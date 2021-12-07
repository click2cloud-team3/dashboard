// Copyright 2020 Authors of Arktos.
// Copyright 2020 Authors of Arktos - file modified.
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

package tenant

import (
	"github.com/kubernetes/dashboard/src/app/backend/resource/dataselect"
	v1 "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"log"
)

// The code below allows to perform complex data section on []api.Tenant

// TenantSpec is a specification of tenant to create.
type TenantSpec struct {
	// Name of the tenant.
	Name             string `json:"name"`
	StorageClusterId string `json:"storageclusterid"`
}

// CreateTenant creates tenant based on given specification.
func CreateTenant(spec *TenantSpec, client kubernetes.Interface) error {
	log.Printf("Creating tenant %s", spec.Name)

	tenant := &v1.Tenant{
		ObjectMeta: metaV1.ObjectMeta{
			Name: spec.Name,
			// Name: "",
		},
		Spec: v1.TenantSpec{
			//StorageClusterId: spec.StorageClusterId,
			StorageClusterId: "0",
		},
	}
	_, err := client.CoreV1().Tenants().Create(tenant)
	//log.Printf("Response of tenant creation 112 : %v", d)
	//log.Printf("Error of tenant creation 112 : %s", err.Error())
	return err
}

type TenantCell v1.Tenant

func (self TenantCell) GetProperty(name dataselect.PropertyName) dataselect.ComparableValue {
	switch name {
	case dataselect.NameProperty:
		return dataselect.StdComparableString(self.ObjectMeta.Name)
	case dataselect.CreationTimestampProperty:
		return dataselect.StdComparableTime(self.ObjectMeta.CreationTimestamp.Time)
	default:
		return nil
	}
}

func toCells(std []v1.Tenant) []dataselect.DataCell {
	cells := make([]dataselect.DataCell, len(std))
	for i := range std {
		cells[i] = TenantCell(std[i])
	}
	return cells
}

func fromCells(cells []dataselect.DataCell) []v1.Tenant {
	std := make([]v1.Tenant, len(cells))
	for i := range std {
		std[i] = v1.Tenant(cells[i].(TenantCell))
	}
	return std
}
