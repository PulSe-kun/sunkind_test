export default {
    //设备状态
    status: [
        {
            id: '',
            value: "全部",
        },
        {
            id: 0,
            value: "正常",
        },
        {
            id: 1,
            value: "停用",
        },
    ],
    //保养周期
    cycleType: [
        {
            id: 0,
            value: "天",
        },
        {
            id: 1,
            value: "周",
        },
        {
            id: 2,
            value: "月",
        },
    ],
    //保养状态
    maintainStatus: [
        {
            id: '',
            value: "全部",
        },
        {
            id: 0,
            value: "待处理",
        },
        {
            id: 1,
            value: "已保养",
        },
        {
            id: 2,
            value: "无需保养",
        },
        {
            id: 3,
            value: "已作废",
        },
    ],
    //点检状态
    inspectionStatus: [
        {
            id: '',
            value: "全部",
        },
        {
            id: 0,
            value: "待处理",
        },
        {
            id: 1,
            value: "已点检",
        },
        {
            id: 2,
            value: "已作废",
        },
    ],
    //维修状态
    repairStatus: [
        {
            id: '',
            value: "全部",
        },
        {
            id: 0,
            value: "待处理",
        },
        {
            id: 1,
            value: "已维修",
        },
        {
            id: 2,
            value: "作废",
        },
        {
            id: 3,
            value: "误报",
        },
    ],
    malfunctions: [
        {
            id: "1",
            value: "设计缺陷",
        },
        {
            id: "2",
            value: "人为损坏",
        },
        {
            id: "3",
            value: "配件老化",
        },
        {
            id: "4",
            value: "超负荷",
        },
        {
            id: "5",
            value: "维保不当",
        },
        {
            id: "6",
            value: "其他",
        },
    ],
    //处置状态
    dispositionStatus: [
        {
            id: '',
            value: "全部",
        },
        {
            id: 0,
            value: "审批中",
        },
        {
            id: 1,
            value: "通过",
        },
        {
            id: 2,
            value: "驳回",
        },
        {
            id: 3,
            value: "撤回",
        },
        {
            id: 4,
            value: "发起审批",
        }
    ],
    //停机原因:
    shutDownReason: [
        {
            id: 0,
            value: "维修",
        },
        {
            id: 1,
            value: "保养",
        },
        {
            id: 2,
            value: "空闲",
        },
        {
            id: 3,
            value: "其他",
        },
    ],
    //折旧状态
    depreciationStatus: [
        {
            id: 0,
            value: "关闭",
        },
        {
            id: 1,
            value: "开启",
        },
    ],
    disposalWay: [
        {
            id: 0,
            value: "报废",
        },
        {
            id: 1,
            value: "变卖",
        },
        {
            id: 2,
            value: "其他",
        },
    ],
    date: [
        {
            id: 1,
            value: '按天'
        },
        {
            id: 2,
            value: '按月'
        },
        {
            id: 3,
            value: '按年'
        }
    ],
}