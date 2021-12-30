// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package resourcequota

import (
	"errors"
	"github.com/kubernetes/dashboard/src/app/backend/api"
	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
)

type ResourceQuotaSpec struct {
	// Name of the resource quota.
	Name                     string `json:"name"`
	Tenant                   string `json:"tenant"`
	NameSpace                string `json:"name_space"`
	ResourceCPU              string `json:"cpu"`
	ResourceMemory           string `json:"memory"`
	ResourcePods             string `json:"pods"`
	ResourceConfigMaps       string `json:"config_maps"`
	ResourcePVC              string `json:"pvc"`
	ResourceSecrets          string `json:"secrets"`
	ResourceServices         string `json:"services"`
	ResourceStorage          string `json:"storage"`
	ResourceEphemeralStorage string `json:"ephemeral_storage"`
}

// ResourceStatus provides the status of the resource defined by a resource quota.
type ResourceStatus struct {
	Used string `json:"used,omitempty"`
	Hard string `json:"hard,omitempty"`
}

// ResourceQuotaDetail provides the presentation layer view of Kubernetes Resource Quotas resource.
type ResourceQuotaDetail struct {
	ObjectMeta api.ObjectMeta `json:"objectMeta"`
	TypeMeta   api.TypeMeta   `json:"typeMeta"`

	// Scopes defines quota scopes
	Scopes []v1.ResourceQuotaScope `json:"scopes,omitempty"`

	// StatusList is a set of (resource name, Used, Hard) tuple.
	StatusList map[v1.ResourceName]ResourceStatus `json:"statusList,omitempty"`
}

// ResourceQuotaDetailList
type ResourceQuotaDetailList struct {
	ListMeta api.ListMeta          `json:"listMeta"`
	Items    []ResourceQuotaDetail `json:"items"`
}

func AddResourceQuotas(client k8sClient.Interface, namespace string, tenant string, spec *ResourceQuotaSpec) (*v1.ResourceQuota, error) {
	if tenant == "" {
		tenant = "default"
	}
	ns, err := client.CoreV1().NamespacesWithMultiTenancy(tenant).Get(namespace, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}

	var resList = make(v1.ResourceList)
	if spec.ResourceCPU != "" {
		resList[v1.ResourceCPU] = resource.MustParse(spec.ResourceCPU)

	}
	if spec.ResourceConfigMaps != "" {
		resList[v1.ResourceConfigMaps] = resource.MustParse(spec.ResourceConfigMaps)
	}
	if spec.ResourcePVC != "" {
		resList[v1.ResourcePersistentVolumeClaims] = resource.MustParse(spec.ResourcePVC)
	}
	if spec.ResourcePods != "" {
		resList[v1.ResourcePods] = resource.MustParse(spec.ResourcePods)
	}
	if spec.ResourceServices != "" {
		resList[v1.ResourceServices] = resource.MustParse(spec.ResourceServices)
	}
	if spec.ResourceSecrets != "" {
		resList[v1.ResourceSecrets] = resource.MustParse(spec.ResourceSecrets)
	}
	if spec.ResourceStorage != "" {
		resList[v1.ResourceStorage] = resource.MustParse(spec.ResourceStorage)
	}
	if spec.ResourceEphemeralStorage != "" {
		resList[v1.ResourceEphemeralStorage] = resource.MustParse(spec.ResourceEphemeralStorage)
	}
	if spec.Tenant == "" {
		spec.Tenant = tenant
	}
	if spec.NameSpace == "" {
		spec.NameSpace = namespace
	}
	if spec.Name == "" {
		err := errors.New("empty resource-quota name error")
		return nil, err
	}
	resQuota, err := client.CoreV1().ResourceQuotasWithMultiTenancy(namespace, ns.Tenant).Create(&v1.ResourceQuota{
		TypeMeta: metaV1.TypeMeta{},
		ObjectMeta: metaV1.ObjectMeta{
			Name:      spec.Name,
			Tenant:    spec.Tenant,
			Namespace: spec.NameSpace,
		},

		Spec: v1.ResourceQuotaSpec{
			Hard:          resList,
			Scopes:        nil,
			ScopeSelector: nil,
		},
		Status: v1.ResourceQuotaStatus{},
	})
	if err != nil {
		return nil, err
	}

	return resQuota, nil
}

// DeleteResourceQuota

func DeleteResourceQuota(client k8sClient.Interface, namespace string, tenant string, name string) error {
	if tenant == "" {
		tenant = "default"
	}
	ns, err := client.CoreV1().NamespacesWithMultiTenancy(tenant).Get(namespace, metaV1.GetOptions{})
	if err != nil {
		return nil
	}

	err = client.CoreV1().ResourceQuotasWithMultiTenancy(namespace, ns.Tenant).Delete(name, &metaV1.DeleteOptions{})
	if err != nil {
		return nil
	}

	return nil
}

func GetResourceQuotaLists(client k8sClient.Interface, namespace string, tenant string) (*ResourceQuotaDetailList, error) {
	if tenant == "" {
		tenant = "default"
	}
	ns, err := client.CoreV1().NamespacesWithMultiTenancy(tenant).Get(namespace, metaV1.GetOptions{})
	if err != nil {
		return nil, err
	}
	list, err := client.CoreV1().ResourceQuotasWithMultiTenancy(namespace, ns.Tenant).List(metaV1.ListOptions{})
	if err != nil {
		return nil, err
	}

	result := &ResourceQuotaDetailList{
		Items:    make([]ResourceQuotaDetail, 0),
		ListMeta: api.ListMeta{TotalItems: len(list.Items)},
	}
	for _, item := range list.Items {
		detail := ToResourceQuotaDetail(&item)
		result.Items = append(result.Items, *detail)
	}

	return result, nil

}

func ToResourceQuotaDetail(rawResourceQuota *v1.ResourceQuota) *ResourceQuotaDetail {
	statusList := make(map[v1.ResourceName]ResourceStatus)

	for key, value := range rawResourceQuota.Status.Hard {
		used := rawResourceQuota.Status.Used[key]
		statusList[key] = ResourceStatus{
			Used: used.String(),
			Hard: value.String(),
		}
	}
	return &ResourceQuotaDetail{
		ObjectMeta: api.NewObjectMeta(rawResourceQuota.ObjectMeta),
		TypeMeta:   api.NewTypeMeta(api.ResourceKindResourceQuota),
		Scopes:     rawResourceQuota.Spec.Scopes,
		StatusList: statusList,
	}
}
