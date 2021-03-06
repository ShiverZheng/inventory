import React, { useEffect, useState } from 'react'
import Q from 'q'
import moment from 'moment'
import {
    Table,
    TablePaginationConfig,
    Button,
    message,
    Modal,
    Space,
    Form,
    Input,
    Divider,
    DatePicker,
} from 'antd'
import {
    ExclamationCircleOutlined,
    PlusOutlined,
    RedoOutlined,
    SearchOutlined,
} from '@ant-design/icons'
import {
    getGlassesList,
    createOrSaveGlasses,
    deleteGlasses,
    searchGlasses,
} from '@src/api/controller/glasses'
import Glasses, { LR } from '@src/api/models/Glasses'
import { PageRequest } from '@src/api/models/Page'
import GlassesForm from './GlassesForm'
import './index.css'

const toFixed2 = (value: number | string) => {
    let val = 0
    if (typeof value === 'string') {
        val = parseFloat(value)
    } else {
        val = value
    }
    if (val > 0) {
        return `+${val.toFixed(2)}`
    }
    if (val < 0) return val.toFixed(2)
    return 0
}

const toPageQuery = (pageReq: PageRequest) => ({
    page: pageReq.page.toString(),
    size: pageReq.size.toString(),
})

const LRLabel = {
    [LR.L]: 'L',
    [LR.R]: 'R',
}

const sortData = (glasses: Glasses[]): Glasses[] =>
    glasses.map((v) => {
        v.eyes.sort((a, b) => b.lr - a.lr)
        return v
    })

const mergeRow = (row: Glasses, index: number) => {
    if (index % 2 === 0) return { rowSpan: 2 }
    return { rowSpan: 0 }
}

export default function Classes() {
    const [form] = Form.useForm()
    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [page, setPage] = useState<PageRequest>({ page: 1, size: 20 })
    const [total, setTotal] = useState<number>(0)
    const [loading, setLoaging] = useState<boolean>(false)
    const [glasses, setGlasses] = useState<Glasses[]>([])
    const [dataSource, setDataSource] = useState<Glasses[]>([])

    const handleChange = (pagination: TablePaginationConfig) => {
        setPage({ page: pagination.current, size: pagination.pageSize })
    }

    const handleCreate = async () => {
        const data = await showFormModal()
        if (!data) return
        const res = await createOrSaveGlasses(data)
        if (res) {
            message.success('????????????')
            getList(page)
        }
    }

    const handleEdit = async (row: Glasses) => {
        const data = glasses.find((v) => v.id === row.id)
        if (!data) {
            message.warn('????????????????????????')
            return
        }
        const editedData = await showFormModal(data)
        if (!editedData) return
        const res = await createOrSaveGlasses(editedData)
        if (res) {
            message.success('????????????')
            getList(page)
        }
    }

    const handleDelete = (row: Glasses) => {
        Modal.confirm({
            title: '????????????????????????????',
            icon: <ExclamationCircleOutlined />,
            content: '????????????????????????????????????????????????',
            okText: '??????',
            okType: 'danger',
            cancelText: '??????',
            onOk: async () => {
                const res = await deleteGlasses({
                    params: { id: row.id.toString() },
                })
                if (res) {
                    message.success('????????????')
                } else {
                    message.error('????????????')
                }
                getList(page)
            },
        })
    }

    const getList = async (p: PageRequest) => {
        setLoaging(true)
        const res = await getGlassesList({ query: toPageQuery(p) })
        setLoaging(false)
        if (!res) return
        const { data, total } = res
        setTotal(total)
        setGlasses(data)
        const formated = sortData(data)
        setDataSource(formated)
    }

    const showFormModal = async (glasses?: Glasses) => {
        const d = Q.defer<Glasses>()
        Modal.confirm({
            icon: null,
            width: '80%',
            closable: true,
            content: (
                <GlassesForm
                    glasses={glasses}
                    onSave={(data: Glasses) => d.resolve(data)}
                />
            ),
            okButtonProps: { style: { display: 'none' } },
            cancelButtonProps: { style: { display: 'none' } },
            onCancel: () => {
                d.resolve(null)
            },
        })
        const res = await d.promise
        Modal.destroyAll()
        return res
    }

    const handleSearch = async () => {
        setIsSearch(true)
        const values = form.getFieldsValue()
        setLoaging(true)

        const query: any = {
            page: '1',
            size: page.size.toString(),
        }
        if (values.name) {
            query.name = values.name
        }
        if (values.phone) {
            query.phone = values.phone
        }
        if (values.orderID) {
            query.orderID = values.orderID
        }
        if (values.dateRange) {
            query.startAt = values.dateRange[0].valueOf()
            query.endAt = values.dateRange[1].valueOf()
        }
        const res = await searchGlasses({ query })
        setLoaging(false)

        if (!res) return
        const { data, total } = res
        setTotal(total)
        setGlasses(data)
        const formated = sortData(data)
        setDataSource(formated)
        setPage({ page: 1, size: page.size })
        setIsSearch(false)
    }

    useEffect(() => {
        (async () => {
            if (!isSearch) {
                await getList(page)
            }
        })()
    }, [page.page, page.size])

    return (
        <div style={{ padding: 10 }}>
            <Space style={{ marginTop: 10 }}>
                <Button icon={<PlusOutlined />} onClick={handleCreate}>
                    ??????
                </Button>
                <Button icon={<RedoOutlined />} onClick={() => getList(page)}>
                    ??????
                </Button>
            </Space>
            <Divider style={{ margin: '10px 0' }} />
            <Space style={{ marginBottom: 10 }}>
                <Form form={form} layout="inline">
                    <Form.Item name="name">
                        <Input placeholder="??????????????????" />
                    </Form.Item>
                    <Form.Item name="phone">
                        <Input placeholder="????????????????????????" />
                    </Form.Item>
                    <Form.Item name="orderID">
                        <Input placeholder="????????????" />
                    </Form.Item>
                    <Form.Item name="dateRange">
                        <DatePicker.RangePicker
                            placeholder={['???????????????', '???????????????']}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            icon={<SearchOutlined />}
                            onClick={handleSearch}
                        >
                            ??????
                        </Button>
                    </Form.Item>
                </Form>
            </Space>
            <Table
                bordered
                size="small"
                scroll={{ x: 1500 }}
                pagination={{
                    total,
                    hideOnSinglePage: false,
                    showSizeChanger: true,
                    pageSize: page.size,
                    showTotal: (total) => {
                        return `??? ${total} ???`
                    },
                }}
                rowKey="id"
                loading={loading}
                columns={[
                    {
                        title: '????????????',
                        dataIndex: 'orderAt',
                        key: 'orderAt',
                        width: 90,
                        fixed: 'left',
                        render: (value) =>
                            moment(Number(value)).format('YYYY-MM-DD'),
                    },
                    {
                        title: '??????',
                        dataIndex: 'name',
                        key: 'name',
                        width: 90,
                        fixed: 'left',
                    },
                    {
                        title: '??????',
                        dataIndex: 'orderID',
                        key: 'orderID',
                        width: 90,
                    },
                    {
                        title: '??????',
                        dataIndex: 'phone',
                        key: 'phone',
                        width: 120,
                    },
                    {
                        title: '????????????',
                        dataIndex: 'frameBrand',
                        key: 'frameBrand',
                        width: 100,
                    },
                    {
                        title: '????????????',
                        dataIndex: 'frameModel',
                        key: 'frameModel',
                        width: 120,
                    },
                    {
                        title: '????????????',
                        dataIndex: 'frameHeight',
                        key: 'frameHeight',
                        width: 50,
                    },
                    {
                        title: '????????????',
                        dataIndex: 'frameSize',
                        key: 'frameSize',
                        width: 80,
                    },
                    {
                        title: '????????????',
                        dataIndex: 'glassBrand',
                        key: 'glassBrand',
                        width: 100,
                    },
                    // {
                    // 	title: '?????????',
                    // 	dataIndex: 'indexOfRefraction',
                    // 	key: 'indexOfRefraction',
                    // 	width: 60,
                    // 	onCell: mergeRow
                    // },
                    {
                        title: '??????',
                        dataIndex: 'glassModel',
                        key: 'glassModel',
                        width: 150,
                    },
                    {
                        title: 'L/R',
                        key: 'lr',
                        width: 40,
                        render: (_, row: Glasses) => {
                            return (
                                <div className="cell">
                                    <div>{LRLabel[row.eyes[0].lr]}</div>
                                    <div>{LRLabel[row.eyes[1].lr]}</div>
                                </div>
                            )
                        },
                    },
                    // {
                    // 	title: '??????',
                    // 	dataIndex: 'glassCount',
                    // 	key: 'glassCount',
                    // 	width: 50,
                    // },
                    {
                        title: '??????',
                        children: [
                            {
                                title: '??????',
                                key: 'degreeS',
                                width: 60,
                                render: (_, row: Glasses) => {
                                    return (
                                        <div className="cell">
                                            <div>
                                                {toFixed2(row.eyes[0].degreeS)}
                                            </div>
                                            <div>
                                                {toFixed2(row.eyes[1].degreeS)}
                                            </div>
                                        </div>
                                    )
                                },
                            },
                            {
                                title: '??????',
                                dataIndex: ['eyes', 0, 'degreeC'],
                                key: 'degreeC',
                                width: 60,
                                render: (_, row: Glasses) => {
                                    return (
                                        <div className="cell">
                                            <div>
                                                {toFixed2(row.eyes[0].degreeC)}
                                            </div>
                                            <div>
                                                {toFixed2(row.eyes[1].degreeC)}
                                            </div>
                                        </div>
                                    )
                                },
                            },
                            {
                                title: '??????',
                                dataIndex: 'axial',
                                key: 'axial',
                                width: 50,
                                render: (_, row: Glasses) => {
                                    return (
                                        <div className="cell">
                                            <div>{row.eyes[0].axial}</div>
                                            <div>{row.eyes[1].axial}</div>
                                        </div>
                                    )
                                },
                            },
                        ],
                    },
                    {
                        title: '??????(PH)',
                        key: 'ph',
                        width: 55,
                        render: (_, row: Glasses) => {
                            return (
                                <div className="cell">
                                    <div>{row.eyes[0].ph}</div>
                                    <div>{row.eyes[1].ph}</div>
                                </div>
                            )
                        },
                    },
                    {
                        title: '??????(PD)',
                        key: 'pd',
                        width: 50,
                        render: (_, row: Glasses) => {
                            return (
                                <div className="cell">
                                    <div>{row.eyes[0].pd}</div>
                                    <div>{row.eyes[1].pd}</div>
                                </div>
                            )
                        },
                    },
                    {
                        title: '????????????',
                        dataIndex: 'sumPD',
                        key: 'sumPD',
                        width: 45,
                        render: (value: number, row: Glasses) => {
                            return (
                                <>
                                    {value
                                        ? value
                                        : row.eyes.reduce((p, c) => {
                                            if (c.pd) return (p += parseFloat(c.pd))
                                            return ''
                                        }, 0)}
                                </>
                            )
                        },
                    },
                    {
                        title: 'ADD',
                        dataIndex: 'add',
                        key: 'add',
                        width: 65,
                        render: toFixed2
                    },
                    {
                        title: '????????????',
                        dataIndex: 'framePrice',
                        key: 'framePrice',
                        width: 80,
                        render: (value) => (value ? `?? ${value}` : ''),
                    },
                    {
                        title: '????????????',
                        dataIndex: 'glassPrice',
                        key: 'glassPrice',
                        width: 80,
                        render: (value) => (value ? `?? ${value}` : ''),
                    },
                    {
                        title: '??????',
                        dataIndex: 'amount',
                        key: 'amount',
                        width: 80,
                        render: (value) => (value ? `?? ${value}` : ''),
                    },
                    {
                        title: '??????',
                        dataIndex: 'comment',
                        key: 'comment',
                        width: 120,
                    },
                    {
                        title: '??????',
                        key: 'option',
                        fixed: 'right',
                        width: 115,
                        render: (_, row) => (
                            <Button.Group size="small">
                                <Button onClick={() => handleEdit(row)}>
                                    ??????
                                </Button>
                                <Button onClick={() => handleDelete(row)}>
                                    ??????
                                </Button>
                            </Button.Group>
                        ),
                    },
                ]}
                dataSource={dataSource}
                onChange={handleChange}
            />
        </div>
    )
}
