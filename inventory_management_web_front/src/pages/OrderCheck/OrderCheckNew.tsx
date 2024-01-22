import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageLayoutAlert, PageLayoutNew, RouteGuardButton } from '../../components';
import { SelectBox, TextInput, PrimaryButton, SelectBoxSearch, DeleteButton } from '../../UIkit';
import { validationRules } from "../../config/validationConfig";
import { CircularProgress, Grid, Stack } from '@mui/material';
import Swal from 'sweetalert2'
import moment from 'moment'

import { useForm, SubmitHandler, useWatch } from 'react-hook-form'
// API imports
import { AxiosError } from "axios";
import { apiPath } from "../../config/authConfig";
import { ApiGet, ApiPost, ApiPut, ApiGetUnAuth, ApiDelete } from "../../utils/ApiCall";
import { getErrorMessage } from "../../utils/ErrorMessage";

// Msal imports
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { BottomNavigationBarNew } from "../../components/BottomNavigationBarNew";


const CreateContent = (props: { routeCat: string, routeMethod: string, routePath: string, routePrm: string }) => {
    const urlParams = useParams<{ id: string }>()  // edit id
    const urlParamsId: number | undefined = Number(urlParams.id || undefined)
    const [editMode, setEditMode] = useState<{ mode: boolean, opentime: string | undefined, disabledFlg: boolean, material_order_phase: string }>({ mode: urlParamsId ? true : false, opentime: undefined, disabledFlg: false, material_order_phase: "" });
    const navigate = useNavigate()
    const { instance, inProgress } = useMsal();
    const [products, setProducts] = useState<{ id: string | number; name: string, unit: string, contents: Number }[]>([]);
    const [orderStatus, setOrderStatus] = useState<{ id: string | number; name: string, phase: string }[]>([]);
    const [orderPhase, setOrderPhase] = useState<{ now: string; current: string }>({ now: "order", current: "order" });

    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<String>("");

    type Inputs = {
        product_id: { id: string | number; name: string, unit: string, contents: Number } | null
        order_cnt: number | ""
        order_price: number | ""
        order_date: String | ""
        deliver_date: String | ""
        order_check_date: String | ""
        order_check_cnt_unit: number | ""
        order_product_status_id: number | ""
        remarks: String | ""
        // tmp
        order_cnt_unit: number | ""
        order_check_cnt: number | ""
    }

    const { control, handleSubmit, reset, setValue } = useForm<Inputs>({
        defaultValues: { product_id: null, order_cnt: "", order_price: "", order_date: moment().format("yyyy-MM-DD"), deliver_date: urlParamsId ? moment().format("yyyy-MM-DD") : "", order_check_date: urlParamsId ? moment().format("yyyy-MM-DD") : "", order_check_cnt_unit: 0, order_product_status_id: "", remarks: "", order_cnt_unit: 0, order_check_cnt: 0 }
    })

    // DidMount
    useEffect(() => {
        const getInitData = async () => {
            try {
                await ApiGet(apiPath.master.vProductNow, ``, props.routeCat)
                    .then(response => handleChangeProduct(response))
            } catch (e: any) {
                handleChangeError(e)
            }
        }

        const mainFunction = async () => {
            if (inProgress === InteractionStatus.None) {
                if (props.routeMethod === "new") {
                    setLoading(true)
                    await getPhaseData("order")
                    await getInitData()
                    setLoading(false)
                } else {
                    setLoading(true)
                    await getInitData()
                    await getEditData()
                    setLoading(false)
                }
            }
        }
        mainFunction()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlParamsId, props.routeMethod, inProgress, instance]);

    // Change CallBackFunctions
    const handleChangeProduct = useCallback((result: any) => {
        const tmp = result.data.map((value: { id: number, product_code: string, product_name: string, supplier_name: string, unit: string, contents: number }) => {
            return { id: value.id, name: `${value.product_code}:${value.product_name} (${value.supplier_name})`, unit: value.unit, contents: value.contents }
        })
        setProducts(tmp)
    }, [setProducts]);
    const handleChangeOrderSts = useCallback((result: any) => {
        const tmp = result.data.map((value: { id: number, order_product_status: string, phase: string }) => {
            return { id: value.id, name: value.order_product_status, phase: value.phase }
        })
        setOrderStatus(tmp)
    }, [setOrderStatus]);
    const handleChangeCurrentDt = useCallback((result: any) => {
        setEditMode({ ...editMode, "mode": true, "opentime": result.data })
    }, [editMode]);
    const handleChangeResetAsyncForm = useCallback(async (result: any) => {
        await getPhaseData(result.data.phase)
        Object.keys(result.data).forEach(function (key) { if (result.data[key] === null) { result.data[key] = "" } })
        const value = result.data
        reset({
            product_id: { id: value.product_id, name: `${value.product_code}:${value.product_name} (${value.supplier_name})`, unit: value.unit, contents: value.contents },
            order_cnt: value.order_cnt,
            order_price: value.order_price,
            order_date: value.order_date,
            deliver_date: value.deliver_date,
            order_check_date: value.order_check_date,
            order_check_cnt_unit: Number(Number(value.order_check_cnt_unit || 0).toFixed(2)),
            order_product_status_id: value.order_product_status_id,
            remarks: value.remarks,
            // tmp
            order_cnt_unit: 0,
            order_check_cnt: Number(Number(value.order_check_cnt || 0).toFixed(0))
        })
        setOrderPhase({ now: value.phase, current: value.phase })
    }, [])
    const handleChangeError = useCallback(async (e: AxiosError) => {
        const htmlMessage = await getErrorMessage(e)
        setError(htmlMessage.split('<br/>').join("\n"))
    }, [setError])

    // OtherFunctions
    const getEditData = async () => {
        try {
            await ApiGetOpentime()
            await ApiGet(apiPath.order.vOrderProduct, `id/${urlParamsId}`, props.routeCat)
                .then(response => handleChangeResetAsyncForm(response))
        } catch (e: any) {
            handleChangeError(e)
        }
    }
    const getPhaseData = async (phase: string) => {
        try {
            await ApiGet(apiPath.order.vOrderProductSts, `phase/${phase}`, props.routeCat)
                .then(response => handleChangeOrderSts(response))
        } catch (e: any) {
            handleChangeError(e)
        }
    }
    const ApiGetOpentime = async () => {
        await ApiGetUnAuth("/current")
            .then(response => handleChangeCurrentDt(response))
            .catch(e => handleChangeError(e))
    }

    // Did Update
    const nowProductInfo = useWatch({ control, name: "product_id" })
    const nowOrderStsId = useWatch({ control, name: "order_product_status_id" });
    useEffect(() => {
        for (let i in orderStatus) {
            if (orderStatus[i].id === nowOrderStsId) {
                setOrderPhase({ ...orderPhase, now: orderStatus[i].phase })
                break
            }
        }
    }, [nowOrderStsId])
    const nowOrderCnt = useWatch({ control, name: "order_cnt" });
    useEffect(() => {
        setValue("order_cnt_unit", Number((Number(nowOrderCnt || 0) * Number(nowProductInfo?.contents || 0)).toFixed(2) || 0))
    }, [nowProductInfo, nowOrderCnt, setValue])
    const nowOrderCheckCntUnit = useWatch({ control, name: "order_check_cnt_unit" });
    useEffect(() => {
        setValue("order_check_cnt", Number((Number(nowOrderCheckCntUnit || 0) / Number(nowProductInfo?.contents || 0)).toFixed(2) || 0))
    }, [nowProductInfo, nowOrderCheckCntUnit, setValue])

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        setSubmitting(true)
        const datas: any = data
        Object.keys(datas).forEach(function (key) { if (datas[key] === "") { datas[key] = null } })
        const values = {
            id: urlParamsId || undefined,
            product_id: datas.product_id?.id,
            order_cnt: datas.order_cnt,
            order_price: datas.order_price,
            order_date: datas.order_date,
            deliver_date: datas.deliver_date,
            order_check_date: datas.order_check_date,
            order_check_cnt_unit: datas.order_check_cnt_unit,
            order_product_status_id: datas.order_product_status_id,
            remarks: datas.remarks,
        }

        // status phase:close時の入力箇所チェック
        for (let i in orderStatus) {
            if (orderStatus[i].id === values.order_product_status_id) {
                if (orderStatus[i].phase !== "complete" && (values.order_check_date || values.order_check_cnt_unit > 0)) {
                    await Swal.fire({
                        title: '[状況]が一致しません',
                        html: "[検品日][検品数量]が入力されています。[状況]を検品済に変更してください。",
                        icon: 'warning'
                    })
                    setSubmitting(false)
                    return
                }
                break
            }
        }

        if (props.routeMethod === "new") {
            try {
                const ret: any = await ApiPost(apiPath.order.orderProduct, values, props.routeCat)
                await Swal.fire({
                    title: '登録完了',
                    html: `登録が完了しました`,
                    timer: 5000,
                    icon: 'success'
                })
                navigate(`/${props.routePath}/edit/${ret.data.id}${props.routePrm}`, { replace: true })
            } catch (e: any) {
                const htmlMessage = await getErrorMessage(e)
                await Swal.fire({
                    title: '登録失敗',
                    html: htmlMessage,
                    //timer: 5000,
                    icon: 'error'
                })
            }
        } else if (props.routeMethod === "edit" && urlParamsId) {
            try {
                // 在庫状況チェック
                const retStockCnt: any = await ApiGet(apiPath.stock.vReportStockProduct, `id/${urlParamsId}`, props.routeCat)
                if (Number(retStockCnt.data?.use_cnt) > values.order_check_cnt_unit) {
                    await Swal.fire({
                        title: '登録失敗',
                        html: "製品が在庫数量を上回るため更新できません",
                        //timer: 5000,
                        icon: 'error'
                    })
                    setSubmitting(false)
                    return
                }

                // 更新
                await ApiPut(apiPath.order.orderProduct, editMode.opentime || "", values, props.routeCat)
                await Swal.fire({
                    title: '更新完了',
                    html: `更新が完了しました`,
                    timer: 5000,
                    icon: 'success'
                })

                navigate(`/${props.routePath}/edit/${urlParamsId}${props.routePrm}`, { replace: true })
                await getEditData()  // opentime更新
            } catch (e: any) {
                const htmlMessage = await getErrorMessage(e)
                await Swal.fire({
                    title: '更新失敗',
                    html: htmlMessage,
                    //timer: 5000,
                    icon: 'error'
                })
            }
        }
        setSubmitting(false)
    }

    const handleClickDelete = async () => {
        setSubmitting(true)

        const result = await Swal.fire({
            title: '[管理者Mode]削除開始',
            text: "[削除]後は元に戻せません。また仕入在庫が減少します。\n続行しますか？",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '続行する',
            cancelButtonText: '中止する',
        })
        try {
            if (result.isConfirmed) {
                // 在庫状況チェック
                const retStockCnt: any = await ApiGet(apiPath.stock.vReportStockProduct, `id/${urlParamsId}`, props.routeCat)
                if (Number(retStockCnt.data?.use_cnt || 999) !== 0) {
                    await Swal.fire({
                        title: '削除失敗',
                        html: "製品が既に使用されているため削除できません",
                        //timer: 5000,
                        icon: 'error'
                    })
                    setSubmitting(false)
                    return
                }

                await ApiDelete(`${apiPath.order.orderProduct}/${urlParamsId}`, editMode.opentime || "", props.routeCat)
                await Swal.fire({
                    title: '削除完了',
                    html: `「削除」が完了しました (No.${urlParamsId})`,
                    timer: 5000,
                    icon: 'success'
                })
                navigate(`/${props.routePath}${props.routePrm}`, { replace: true })
                return
            }
        } catch (e: any) {
            const htmlMessage = await getErrorMessage(e)
            await Swal.fire({
                title: '削除失敗',
                html: htmlMessage,
                //timer: 5000,
                icon: 'error'
            })
            setSubmitting(false)
            return
        }
        setSubmitting(false)
    }


    if (error) {
        return (<PageLayoutAlert errMsg={error} />)
    }

    return (
        <>
            {loading === true ?
                <div className="text-center + mt-3"><CircularProgress size={80} color="info" /></div>
                :
                <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <SelectBox
                            name="order_product_status_id" control={control} validationRule={validationRules.state} disabled={editMode.disabledFlg}
                            label={"状況"} widthType={"xsmall"} options={orderStatus}
                        />
                    </div>
                    <div>
                        <Grid container style={{ "alignItems": "center" }}>
                            <Grid xs={11} item>
                                <SelectBoxSearch
                                    name="product_id" control={control} validationRule={validationRules.stateSearch} disabled={editMode.mode} disableClearable={true}
                                    label={"製品名"} widthType={"full"} options={products}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <div>
                        <TextInput
                            name="order_date" type={"date"} control={control} validationRule={validationRules.text} disabled={editMode.mode}
                            label={"発注日"} widthType={"xsmall"} rows={1} shrink={true}
                        />
                        <TextInput
                            name="order_cnt" type={"number"} control={control} validationRule={validationRules.numberDecimal10_2Unsigned} disabled={editMode.mode}
                            label={"発注数量(ロット)"} widthType={"xsmall"} rows={1}
                        />
                        <TextInput
                            name="order_cnt_unit" type={"number"} control={control} validationRule={{}} disabled={true}
                            label={`発注数量(単位: ${nowProductInfo?.unit || ""}) ※自動`} widthType={"xsmall"} rows={1}
                        />
                        {nowProductInfo?.unit || ""}
                        <TextInput
                            name="order_price" type={"number"} control={control} validationRule={validationRules.numberIntSigned} disabled={editMode.mode}
                            label={"発注額(円)税抜"} widthType={"xsmall"} rows={1}
                        />
                    </div>
                    <div>
                        <TextInput
                            name="deliver_date" type={"date"} control={control} validationRule={validationRules.text} disabled={editMode.disabledFlg}
                            label={"納品日(予定含)"} widthType={"xsmall"} rows={1} shrink={true}
                        />
                    </div>
                    {orderPhase.now === "complete" ?
                        <div>
                            <TextInput
                                name="order_check_date" type={"date"} control={control} validationRule={orderPhase.now === "complete" ? validationRules.text : {}} disabled={editMode.disabledFlg}
                                label={"検品日"} widthType={"xsmall"} rows={1} shrink={true}
                            />
                            <TextInput
                                name="order_check_cnt" type={"number"} control={control} validationRule={{}} disabled={true}
                                label={`検品数量(ロット) ※自動`} widthType={"xsmall"} rows={1}
                            />
                            <TextInput
                                name="order_check_cnt_unit" type={"number"} control={control} validationRule={validationRules.numberDecimal10_2Unsigned} disabled={editMode.disabledFlg}
                                label={`検品数量(単位: ${nowProductInfo?.unit || ""})`} widthType={"xsmall"} rows={1}
                            />
                            {nowProductInfo?.unit || ""}
                        </div>
                        : <></>
                    }
                    <div>
                        <TextInput
                            name="remarks" type={"text"} control={control} validationRule={{}} disabled={false}
                            label={"備考"} widthType={"full"} rows={5}
                        />
                    </div>

                    <div className="module-spacer--medium" />
                    <div className="center">
                        <RouteGuardButton alert={true} roleCat={props.routeMethod === "new" ? "create" : "update"}>
                            <PrimaryButton label={props.routeMethod === "new" ? "新規登録 開始" : "情報更新 開始"} type="submit" disabled={submitting} onClick={() => { }} />
                        </RouteGuardButton>
                    </div>

                    {(orderPhase.current === 'complete' && urlParamsId) && (
                        <div className="text-end">
                            <RouteGuardButton roleCat="delete" alert={false}>
                                <DeleteButton label="キャンセル(削除)" disabled={submitting} onClick={handleClickDelete} />
                            </RouteGuardButton>
                        </div>
                    )}
                    <BottomNavigationBarNew
                        topPageQuery={`/${props.routePath}${props.routePrm}`}
                        newPageQuery={`/${props.routePath}/new${props.routePrm}`}
                        routeMethod={props.routeMethod}
                    />
                </Stack>
            }
        </>
    )
};


export const OrderCheckNew = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const routeMethod = arrPath.includes("edit") ? "edit" : arrPath.includes("new") ? "new" : "undefined"
    const routeCat = arrPath[1]
    const routePath = `${arrPath[1]}/${arrPath[2]}`
    const routePrm = `?s=${searchParams.get('s') || ""}&e=${searchParams.get('e') || ""}&notCompflg=${searchParams.get('notCompflg') || ""}&supplierCode=${searchParams.get('supplierCode') || ""}`
    return (
        <PageLayoutNew cardTitle="仕入・納品 (在庫増加)" cardSubTitle="仕入管理" cardText="" routePath={`${routePath}${routePrm}`} routeMethod={routeMethod}>
            <CreateContent routeCat={routeCat} routeMethod={routeMethod} routePath={routePath} routePrm={routePrm} />
        </PageLayoutNew>
    )
};
