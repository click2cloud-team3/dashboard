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

package iam

import (
	"github.com/kubernetes/dashboard/src/app/backend/api"
	"github.com/kubernetes/dashboard/src/app/backend/args"
	"github.com/kubernetes/dashboard/src/app/backend/client"
	"github.com/kubernetes/dashboard/src/app/backend/iam/db"
	"github.com/kubernetes/dashboard/src/app/backend/iam/model"
	"github.com/kubernetes/dashboard/src/app/backend/resource/clusterrolebinding"
	ns "github.com/kubernetes/dashboard/src/app/backend/resource/namespace"
	"github.com/kubernetes/dashboard/src/app/backend/resource/serviceaccount"
	rbac "k8s.io/api/rbac/v1"
	"log"
	"os"
	"strings"
)

// Create cluster Admin

func CreateClusterAdmin() error {
	const adminName = "centaurus"
	const dashboardNS = "kubernetes-dashboard"
	const clsterroleName = "cluster-admin"
	const saName = adminName + "-dashboard-sa"
	admin := os.Getenv("CLUSTER_ADMIN")
	if admin == "" {
		admin = adminName
	}
	clientManager := client.NewClientManager(args.Holder.GetKubeConfigFile(), args.Holder.GetApiServerHost())

	// TODO Check if kubernetes-dashboard namespace exists or not using GET method
	k8sClient := clientManager.InsecureClient()

	// Create namespace
	namespaceSpec := new(ns.NamespaceSpec)
	namespaceSpec.Name = dashboardNS
	if err := ns.CreateNamespace(namespaceSpec, "system", k8sClient); err != nil {
		log.Printf("Create namespace for admin user failed, err:%s ", err.Error())
		//return err
	} else {
		log.Printf("Create Namespace successfully")
	}

	// Create Serviec Account
	serviceaccountSpec := new(serviceaccount.ServiceAccountSpec)
	serviceaccountSpec.Name = saName
	serviceaccountSpec.Namespace = dashboardNS
	if err := serviceaccount.CreateServiceAccount(serviceaccountSpec, k8sClient); err != nil {
		log.Printf("Create service account for admin user failed, err:%s ", err.Error())
		//return err
	}

	// Create Cluster Role
	//var verbs []string
	//var apiGroups []string
	//var resources []string
	//verbs = append(verbs, "*")
	//apiGroups = append(apiGroups, "", "extensions", "apps")
	//resources = append(resources, "deployments", "pods", "services", "secrets", "namespaces")

	//clusterRoleSpec := &clusterrole.ClusterRoleSpec{
	//	Name:      roleName,
	//	Verbs:     verbs,
	//	APIGroups: apiGroups,
	//	Resources: resources,
	//}
	//
	//if err := clusterrole.CreateClusterRole(clusterRoleSpec, k8sClient); err != nil {
	//	log.Printf("Create cluster role for admin user failed, err:%s ", err.Error())
	//	return err
	//}

	// Create Cluster Role Binding
	clusterRoleBindingSpec := &clusterrolebinding.ClusterRoleBindingSpec{
		Name: "admin-cluster-role-binding",
		Subject: rbac.Subject{
			Kind:      "ServiceAccount",
			APIGroup:  "",
			Name:      saName,
			Namespace: dashboardNS,
		},
		RoleRef: rbac.RoleRef{
			APIGroup: "rbac.authorization.k8s.io",
			Kind:     "ClusterRole",
			Name:     clsterroleName,
		},
	}
	if err := clusterrolebinding.CreateClusterRoleBindings(clusterRoleBindingSpec, k8sClient); err != nil {
		log.Printf("Create cluster role for admin user failed, err:%s ", err.Error())
		//return err
	}

	// Get Token
	secretList, err := k8sClient.CoreV1().SecretsWithMultiTenancy(dashboardNS, "").List(api.ListEverything)
	if err != nil {
		log.Printf("Create cluster role for admin user failed, err:%s \n", err.Error())
		//return err
	}
	var token []byte
	for _, secret := range secretList.Items {
		checkName := strings.Contains(secret.Name, saName)
		if secret.Namespace == dashboardNS && checkName {
			token = secret.Data["token"]
			break
		}
	}

	// Create User and enter data into DB
	user := model.User{
		ID:       0,
		Username: admin,
		Password: "Centaurus@123",
		Token:    string(token),
		Type:     "ClusterAdmin",
		Tenant:   "system",
	}

	if err != nil {
		log.Fatalf("Unable to decode the request body.  %v", err)
	}

	// call insertUser function and pass the user data
	insertID := db.InsertUser(user)

	log.Printf("\n User Id: %d", insertID)
	return nil
}
