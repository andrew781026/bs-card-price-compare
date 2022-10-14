# 學習 K8S 

這篇文章是參考 [How to Deploy Your Application or Microservice on Kubernetes](https://www.youtube.com/watch?v=SfM-82abTkQ&t=599s&ab_channel=DigitalOcean) 來學習的

[相關 PPT](https://docs.google.com/presentation/d/15OH08H3K7xa8TTauRcrkIQZrzlroRjsMXuJZHW4GRBY/edit#slide=id.g9b8b568914_0_0)

## 前置安裝

- kubectl ( k8s 的 cmd 操作指令 , 教學 - [安裝 minikube](https://nina-weng.medium.com/%E5%9C%A8-windows-%E5%AE%89%E8%A3%9D-kubectl-2b3086f69b07) )
- docker ( kind 執行時需要 docker machine )
- kind ( k8s cluster 的執行環境 )

### 安裝 kubectl

1.[下載 kubectl.exe](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)
2.追加 windows 的 PATH 環境變數 `set PATH=%PATH%;C:\your\path\here\`

### 安裝 kind

1.[下載 kind.exe](https://kind.sigs.k8s.io/docs/user/quick-start/#installing-from-release-binaries)
2.追加 windows 的 PATH 環境變數 `set PATH=%PATH%;C:\your\path\here\`

### 學習如何建立 nginx 的 k8s cluster 

第一步 , [複製 nginx 部屬範例](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#creating-a-deployment)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80
```

