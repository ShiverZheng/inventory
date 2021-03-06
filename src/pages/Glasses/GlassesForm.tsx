import React from 'react'
import moment from 'moment'
import { Form, DatePicker, Input, InputNumber, Divider, Button } from 'antd'
import Glasses, { LR, Eye } from '@src/api/models/Glasses'

const { Item } = Form

interface Props {
    glasses?: Glasses
    onSave: (data: Glasses) => void
}

export default function GlassesForm(props: Props) {
    const [form] = Form.useForm()

    let data = null
    if (props.glasses) {
        data = {
            ...props.glasses,
            orderAt: moment(Number(props.glasses.orderAt)),
            eyes: props.glasses.eyes.sort()
        }
    }

    const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
        const id = (e.target as any).id
        if (id === 'framePrice' || id === 'glassPrice') {
            const framePrice = form.getFieldValue('framePrice')
            const glassPrice = form.getFieldValue('glassPrice')
            if (framePrice && glassPrice) {
                form.setFieldsValue({ amount: framePrice + glassPrice })
            }
        }
        if (id === 'eyes_0_pd' || id === 'eyes_1_pd') {
            const lpd = form.getFieldValue(['eyes', 0, 'pd'])
            const rpd = form.getFieldValue(['eyes', 1, 'pd'])
            if (lpd && rpd) {
                form.setFieldsValue({ sumPD: parseFloat(lpd) + parseFloat(rpd) })
            }
        }
    }

    const handleSave = () => {
        form.validateFields()
            .then((values) => {
                const data = {
                    ...values,
                    id: props.glasses && props.glasses.id ? props.glasses.id : null,
                    eyes: values.eyes.map((v: Eye, index: number) => ({ ...v, lr: index === 0 ? LR.L : LR.R })),
                    orderAt: moment(values.orderAt).valueOf()
                }
                props.onSave(data)
            })
    }

    return (
        <Form
            layout='inline'
            labelAlign="left"
            autoComplete='off'
            form={form}
            preserve={false}
            initialValues={data}
            onChange={handleChange}
            labelCol={{ style: { width: 100 } }}
            wrapperCol={{ span: 32, offset: 0 }}
        >
            <Item
                required
                label='????????????'
                name='orderAt'
                labelCol={{ style: { width: 90 } }}
                style={{ marginBottom: 10 }}
                rules={[{ required: true, message: '?????????????????????!' }]}
            >
                <DatePicker placeholder='????????????' format='YYYY-MM-DD' style={{ width: 188 }} />
            </Item>
            <Item
                required
                label='??????'
                name='name'
                labelCol={{ style: { width: 60 } }}
                style={{ marginBottom: 10 }}
                rules={[{ required: true, message: '?????????????????????!' }]}
            >
                <Input style={{ width: 188 }} />
            </Item>
            <Item
                required
                label='??????'
                name='phone'
                labelCol={{ style: { width: 60 } }}
                style={{ marginBottom: 10 }}
                rules={[{ required: true, message: '?????????????????????!' }]}
            >
                <Input style={{ width: 188 }} />
            </Item>
            <Item
                required
                label='??????'
                name='orderID'
                labelCol={{ style: { width: 60 } }}
                rules={[{ required: true, message: '???????????????!' }]}
            >
                <Input style={{ width: 188 }} />
            </Item>
            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
            <Item
                label='????????????'
                name='frameBrand'
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>
            <Item
                label='????????????'
                name='frameModel'
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>
            <Item
                label='????????????'
                name='glassBrand'
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>
            <Item
                label='?????????'
                name='glassModel'
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>
            <Divider style={{ marginTop: 0, marginBottom: 10 }} />
            <Item
                label={<span>????????????<b>R</b></span>}
                name={['eyes', 1, 'degreeS']}
                style={{ marginBottom: 10 }}
            >
                <InputNumber style={{ width: 246 }} />
            </Item>
            <Item
                label={<span>????????????<b>R</b></span>}
                name={['eyes', 1, 'degreeC']}
                style={{ marginBottom: 10 }}
            >
                <InputNumber style={{ width: 246 }} />
            </Item>

            <Item
                label={<span>????????????<b>R</b></span>}
                name={['eyes', 1, 'axial']}
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 246 }} />
            </Item>
            <Item
                label={<span>????????????<b>L</b></span>}
                name={['eyes', 0, 'degreeS']}
                style={{ marginBottom: 10 }}
            >
                <InputNumber style={{ width: 246 }} />
            </Item>
            <Item
                label={<span>????????????<b>L</b></span>}
                name={['eyes', 0, 'degreeC']}
                style={{ marginBottom: 10 }}
            >
                <InputNumber style={{ width: 246 }} />
            </Item>
            <Item
                label={<span>????????????<b>L</b></span>}
                name={['eyes', 0, 'axial']}
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 246 }} />
            </Item>
            <Item
                label={<span>????????????<b>RPH</b></span>}
                name={['eyes', 1, 'ph']}
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>
            <Item
                label={<span>????????????<b>LPH</b></span>}
                name={['eyes', 0, 'ph']}
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>
            <Item
                label={<span>????????????<b>RPD</b></span>}
                name={['eyes', 1, 'pd']}
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>
            <Item
                label={<span>????????????<b>LPD</b></span>}
                name={['eyes', 0, 'pd']}
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>
            <Item
                label='ADD'
                name='add'
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>
            <Item
                label='??????'
                name='sumPD'
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>
            <Divider style={{ marginTop: 0, marginBottom: 10 }} />
            <Item
                label='????????????'
                name='frameHeight'
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>
            <Item
                label='????????????'
                name='frameSize'
                style={{ marginBottom: 10 }}
            >
                <Input style={{ width: 427 }} />
            </Item>

            {/* <Item
				label='?????????'
				name='indexOfRefraction'
				style={{ marginBottom: 10 }}
			>
				<InputNumber style={{ width: 188 }} />
			</Item> */}
            <Item hidden label='??????' name={['eyes', 1, 'lr']} >
                <InputNumber value={LR.L} />
            </Item>
            <Item hidden label='??????' name={['eyes', 0, 'lr']} >
                <InputNumber value={LR.L} />
            </Item>
            <Divider style={{ marginTop: 0, marginBottom: 10 }} />
            {/* <Item
				label='????????????'
				name={['eyes', 0, 'glassCount']}
				style={{ marginBottom: 10 }}
			>
				<InputNumber style={{ width: 188 }} />
			</Item>
			<Item
				label='????????????'
				name={['eyes', 1, 'glassCount']}
				style={{ marginBottom: 10 }}
			>
				<InputNumber style={{ width: 188 }} />
			</Item> */}
            <Item
                label='????????????'
                name='framePrice'
                style={{ marginBottom: 10 }}
            >
                <InputNumber style={{ width: 427 }} />
            </Item>
            <Item
                label='????????????'
                name='glassPrice'
                style={{ marginBottom: 10 }}
            >
                <InputNumber style={{ width: 427 }} />
            </Item>
            <Item
                label='?????????'
                name='amount'
                style={{ marginBottom: 10 }}
            >
                <InputNumber style={{ width: 427 }} />
            </Item>
            <Divider style={{ marginTop: 0, marginBottom: 10 }} />
            <Item label='??????' name='comment'>
                <Input.TextArea autoSize size='large' style={{ minWidth: '970px' }} />
            </Item>
            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
            <Item>
                <Button type='primary' onClick={handleSave}>??????</Button>
            </Item>
        </Form>
    )
}
