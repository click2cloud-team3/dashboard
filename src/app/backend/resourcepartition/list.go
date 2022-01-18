package resourcepartition

import (
	"github.com/kubernetes/dashboard/src/app/backend/api"

	metricapi "github.com/kubernetes/dashboard/src/app/backend/integration/metric/api"
	v1 "k8s.io/api/core/v1"
	client "k8s.io/client-go/kubernetes"
)

type ResourcePartitionList struct {
	ListMeta          api.ListMeta       `json:"listMeta"`
	Partitions        []*Partition       `json:"partitions"`
	CumulativeMetrics []metricapi.Metric `json:"cumulativeMetrics"`

	// List of non-critical errors, that occurred during resource retrieval.
	Errors []error `json:"errors"`
}

type Partition struct {
	Name             string `json:"name"`
	NodeCount        int    `json:"nodeCount"`
	CPULimit         int64  `json:"cpuLimit"`
	MemoryLimit      int64  `json:"memoryLimit"`
	HealthyNodeCount int64  `json:"healthyNodeCount"`
}

func GetPartitionDetail(client client.Interface, cLusterName string) (*Partition, error) {
	nodes, err := client.CoreV1().Nodes().List(api.ListEverything)
	if err != nil {
		return nil, err
	}
	var cpuLimit int64 = 0
	var memoryLimit int64 = 0
	var healthyNodeCount int64 = 0
	for _, node := range nodes.Items {
		cpuLimit += node.Status.Allocatable.Cpu().MilliValue()
		memoryLimit += node.Status.Allocatable.Memory().Value()

		if node.Status.Conditions[0].Type == v1.NodeReady && node.Status.Conditions[0].Status == v1.ConditionTrue {
			healthyNodeCount++
		}
	}
	partitionDetail := new(Partition)
	partitionDetail.NodeCount = len(nodes.Items)
	partitionDetail.CPULimit = cpuLimit
	partitionDetail.MemoryLimit = memoryLimit
	partitionDetail.HealthyNodeCount = healthyNodeCount
	partitionDetail.Name = cLusterName

	return partitionDetail, nil
}
