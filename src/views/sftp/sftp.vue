<template>
    <div>
        <el-tree
            ref="tree"
            :data="data4list"
            :props="defaultProps"
            @node-click="handleTreeNodeClick"
        />
    </div>
</template>

<script>
import request from "../../utils/request";
import sftpRequest from "../../utils/sftpRequest";
import axios from "axios";

// 递归休整数据
function Map2List(map) {
    let list = [];
    for (let [k, v] of Object.entries(map)) {
        if (typeof v === "object") {
            list.push({ label: k, type: "DIRECTORY", children: Map2List(v) });
        } else list.push({ label: k, type: "REGULAR" });
    }
    return list;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
    name: "SftpPage",
    data() {
        return {
            data4list: [],
            defaultProps: {
                children: "children",
                label: "label",
            },
        };
    },
    async created() {
        // let data = {
        //     a: "a",
        //     "通用核心题.md": "通用核心题.md",
        //     dir1: {
        //         dir2: {
        //             "IOC.md": "IOC.md",
        //             dir3: {
        //                 "摘要算法.md": "摘要算法.md",
        //                 "lifetime.md": "lifetime.md",
        //             },
        //         },
        //         dir1: {
        //             dir1: {},
        //         },
        //         "数字证书_原理.md": "数字证书_原理.md",
        //         "编码算法.md": "编码算法.md",
        //     },
        //     "摘要算法.md": "摘要算法.md",
        //     "管道通讯.md": "管道通讯.md",
        // };
        // this.data4list = Map2List(data);
        // init this.data4list
        await this.getTree();
        console.log("this.data4list", this.data4list);
    },
    methods: {
        async getTree() {
            await sftpRequest({
                url: "/sftp/getList",
                data: {},
                method: "post",
            })
                .then((res) => {
                    console.log("res", res);
                    let { data } = res;
                    this.data4list = Map2List(data);
                    console.log("Map2List(data)", Map2List(data));
                })
                .catch((err) => {
                    console.error(`获取数据列表失败：${err}`);
                });
        },
        async handleTreeNodeClick(dataObj, nodeObj, treeObj) {
            console.log("dataObj", dataObj);
            console.log("nodeObj", nodeObj);
            console.log("treeObj", treeObj);

            // 如果是文件夹就展开，其他类型都下载
            if (dataObj.type === "DIRECTORY") {
                // do nothing
            } else {
                // 拦截器，拦截非叶子节点
                if (!nodeObj.isLeaf) return;
                let curNode = nodeObj;
                let downFilePath = "";
                // 向上查找 拼接完整路径名
                while (!(curNode.level == 0)) {
                    downFilePath = "/" + curNode.label + downFilePath;
                    curNode = curNode.parent;
                }
                console.log("downFilePath", downFilePath);
                // download xxx
                await sftpRequest({
                    url: "http://localhost:9000/sftp/download",
                    data: {
                        downFilePath: downFilePath,
                    },
                    method: "post",
                    responseType: "blob",
                })
                    .then(function (res) {
                        const { data, headers } = res;
                        var blob = new Blob([data], {
                            type: headers["content-type"],
                        });

                        const fileName = headers["content-disposition"].replace(
                            /\w+;filename=(.*)/,
                            "$1"
                        );
                        var aElement = document.createElement("a");
                        var href = window.URL.createObjectURL(blob); //创建下载的链接
                        aElement.href = href;
                        aElement.download = fileName; // 下载后文件名
                        aElement.style.display = "none"; // 不显示
                        document.body.appendChild(aElement);
                        aElement.click(); // 点击下载
                        console.log("aElement", aElement);
                        document.body.removeChild(aElement); // 下载完成移除元素
                        window.URL.revokeObjectURL(href); // 释放掉blob对象
                    })
                    .catch(function (err) {
                        console.error(`获取下载文件出错：${err}`);
                    });
            }
        },
    },
};
</script>

