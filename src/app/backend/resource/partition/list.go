package partition

import (
	"github.com/kubernetes/dashboard/src/app/backend/api"
	metricapi "github.com/kubernetes/dashboard/src/app/backend/integration/metric/api"
	v1 "k8s.io/api/core/v1"
	client "k8s.io/client-go/kubernetes"
)

type ResourcePartitionList struct {
	ListMeta          api.ListMeta               `json:"listMeta"`
	Partitions        []*ResourcePartitionDetail `json:"resourcePartitions"`
	CumulativeMetrics []metricapi.Metric         `json:"cumulativeMetrics"`

	// List of non-critical errors, that occurred during resource retrieval.
	Errors []error `json:"errors"`
}

type TenantPartitionList struct {
	ListMeta          api.ListMeta             `json:"listMeta"`
	Partitions        []*TenantPartitionDetail `json:"tenantPartitions"`
	CumulativeMetrics []metricapi.Metric       `json:"cumulativeMetrics"`

	// List of non-critical errors, that occurred during resource retrieval.
	Errors []error `json:"errors"`
}
type ResourcePartitionDetail struct {
	ObjectMeta ResourcePartition `json:"objectMeta"`
	TypeMeta   api.TypeMeta      `json:"typeMeta"`
}

type TenantPartitionDetail struct {
	ObjectMeta TenantPartition `json:"objectMeta"`
	TypeMeta   api.TypeMeta    `json:"typeMeta"`
}

type ResourcePartition struct {
	Name             string `json:"name"`
	NodeCount        int    `json:"nodeCount"`
	CPULimit         int64  `json:"cpuLimit"`
	MemoryLimit      int64  `json:"memoryLimit"`
	HealthyNodeCount int64  `json:"healthyNodeCount"`
}

type TenantPartition struct {
	Name             string `json:"name"`
	TenantCount      int    `json:"tenantCount"`
	CPULimit         int64  `json:"cpuLimit"`
	MemoryLimit      int64  `json:"memoryLimit"`
	HealthyNodeCount int64  `json:"healthyNodeCount"`
}

func GetResourcePartitionDetail(client client.Interface, clusterName string) (*ResourcePartitionDetail, error) {
	nodes, err := client.CoreV1().Nodes().List(api.ListEverything)
	if err != nil {
		return nil, err
	}
	var cpuLimit int64 = 0
	var cpuFree int64 = 0
	var memoryLimit int64 = 0
	var memoryFree int64 = 0
	var healthyNodeCount int64 = 0
	for _, node := range nodes.Items {
		cpuLimit += node.Status.Capacity.Cpu().MilliValue()
		cpuFree += node.Status.Allocatable.Cpu().MilliValue()
		memoryLimit += node.Status.Capacity.Memory().Value()
		memoryFree += node.Status.Allocatable.Memory().Value()

		//if node.Status.Conditions[0].Status == v1.ConditionTrue {
		//	healthyNodeCount++
		//}
		for _, condition := range node.Status.Conditions {
			if condition.Type == v1.NodeConditionType("Ready") && condition.Status == v1.ConditionTrue {
				healthyNodeCount++
				break
			}
		}
	}
	var cpuUsed int64 = int64((cpuLimit - cpuFree) * 100 / cpuLimit)
	var memoryUsed int64 = int64((memoryLimit - memoryFree) * 100 / memoryLimit)
	partitionDetail := new(ResourcePartitionDetail)
	partitionDetail.ObjectMeta.NodeCount = len(nodes.Items)
	partitionDetail.ObjectMeta.CPULimit = cpuUsed
	partitionDetail.ObjectMeta.MemoryLimit = memoryUsed
	partitionDetail.ObjectMeta.HealthyNodeCount = healthyNodeCount
	partitionDetail.ObjectMeta.Name = clusterName
	partitionDetail.TypeMeta.Kind = "ResourcePartition"
	return partitionDetail, nil
}

func GetTenantPartitionDetail(client client.Interface, clusterName string) (*TenantPartitionDetail, error) {
	nodes, err := client.CoreV1().Nodes().List(api.ListEverything)
	if err != nil {
		return nil, err
	}
	var cpuLimit int64 = 0
	var cpuFree int64 = 0
	var memoryLimit int64 = 0
	var memoryFree int64 = 0
	var healthyNodeCount int64 = 0
	for _, node := range nodes.Items {
		cpuLimit += node.Status.Capacity.Cpu().MilliValue()
		cpuFree += node.Status.Allocatable.Cpu().MilliValue()
		memoryLimit += node.Status.Capacity.Memory().Value()
		memoryFree += node.Status.Allocatable.Memory().Value()

		//if node.Status.Conditions[0].Status == v1.ConditionTrue {
		//	healthyNodeCount++
		//}
		for _, condition := range node.Status.Conditions {
			if condition.Type == v1.NodeConditionType("Ready") && condition.Status == v1.ConditionTrue {
				healthyNodeCount++
				break
			}
		}
	}
	tenants, err := client.CoreV1().Tenants().List(api.ListEverything)
	if err != nil {
		return nil, err
	}
	var cpuUsed int64 = int64((cpuLimit - cpuFree) * 100 / cpuLimit)
	var memoryUsed int64 = int64((memoryLimit - memoryFree) * 100 / memoryLimit)
	partitionDetail := new(TenantPartitionDetail)
	partitionDetail.ObjectMeta.TenantCount = len(tenants.Items)
	partitionDetail.ObjectMeta.CPULimit = cpuUsed
	partitionDetail.ObjectMeta.MemoryLimit = memoryUsed
	partitionDetail.ObjectMeta.HealthyNodeCount = healthyNodeCount
	partitionDetail.ObjectMeta.Name = clusterName
	partitionDetail.TypeMeta.Kind = "TenantPartition"

	return partitionDetail, nil
}
