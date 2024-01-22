import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageLayoutAlert, PageLayoutNew, RouteGuardButton } from '../../components';
import { SelectBox, TextInput, PrimaryButton, SelectBoxSearch, DeleteButton } from '../../UIkit';
import { validationRules } from "../../config/validationConfig";
import { CircularProgress, Stack } from '@mui/material';
import Swal from 'sweetalert2'
import { useForm, SubmitHandler } from 'react-hook-form'
import moment from 'moment'

// API imports
import { AxiosError } from "axios";
import { apiPath } from "../../config/authConfig";
import { ApiGet, ApiPost, ApiPut, ApiGetUnAuth, ApiDelete } from "../../utils/ApiCall";
import { getErrorMessage } from "../../utils/ErrorMessage";

// Msal imports
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { BottomNavigationBarNew } from "../../components/BottomNavigationBarNew";


const CreateContent = (props: { routeCat: string, routeMethod: string, index: string, routePath: string, routePrm: string }) => {
    const urlParams = useParams<{ id: string }>()  // edit id
    const urlParamsId: number | undefined = Number(urlParams.id || undefined)
    const [editMode, setEditMode] = useState<{ mode: boolean, opentime: string | undefined }>({ mode: urlParamsId ? true : false, opentime: undefined });
    const navigate = useNavigate()
    const { instance, inProgress } = useMsal();
    const [orderProducts, setOrderProducts] = useState<{ id: number, name: string, stock_cnt: number }[]>([]);
    const [reportCategorys, setReportCategorys] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<String>("");

    type Inputs = {
        report_date: string
        order_product_id: { id: number, name: string, stock_cnt: number, order_check_date: string, code: string } | null
        use_cnt: Number | ''
        day_report_product_category_id: Number | ''
        remarks: string
        use_cnt_before: Number | ''
    }

    const { control, handleSubmit, reset, getValues } = useForm<Inputs>({
        defaultValues: {
            report_date: moment().format("yyyy-MM-DD"), order_product_id: null, use_cnt: 0, use_cnt_before: 0, day_report_product_category_id: "", remarks: ""
        }
    })

    // DidMount
    useEffect(() => {
        const getInitData = async () => {
            try {
                if (props.index === "product") {
                    await ApiGet(apiPath.stock.vReportStockProduct, ``, props.routeCat)
                        .then(response => handleChangeOrderProducts(response))
                }
                await ApiGet(apiPath.dayreport.vDayRepCat1, ``, props.routeCat)
                    .then(response => handleChangeProductReportCategory(response))
            } catch (e: any) {
                handleChangeError(e)
            }
        }

        const mainFunction = async () => {
            if (inProgress === InteractionStatus.None) {
                if (props.routeMethod === "new") {
                    setLoading(true)
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
    const ApiGetOpentime = async () => {
        await ApiGetUnAuth("/current")
            .then(response => handleChangeCurrentDt(response))
            .catch(e => handleChangeError(e))
    }

    // Change CallBackFunctions
    const handleChangeOrderProducts = useCallback((result: any) => {
        const tmp = result.data.map((value: { id: number, product_code: string, product_name: string, stock_cnt: Number, unit: string, order_check_date: string }) => {
            return { id: value.id, name: `${value.order_check_date} [${value.product_code}]${value.product_name} (在庫:${Number(Number(value.stock_cnt || 0).toFixed(2)).toLocaleString()}${value.unit})`, stock_cnt: value.stock_cnt, order_check_date: value.order_check_date, code: value.product_code }
        })
        setOrderProducts(tmp)
    }, [setOrderProducts]);
    const handleChangeProductReportCategory = useCallback((result: any) => {
        const tmp = result.data.map((value: { id: number, day_report_product_category: string }) => {
            return { id: value.id, name: value.day_report_product_category }
        })
        setReportCategorys(tmp)
    }, [setReportCategorys]);
    const handleChangeCurrentDt = useCallback((result: any) => {
        setEditMode({ ...editMode, "mode": true, "opentime": result.data })
    }, [editMode]);
    const handleChangeResetAsyncForm = useCallback(async (result: any) => {
        Object.keys(result.data).forEach(function (key) { if (result.data[key] === null) { result.data[key] = "" } })
        const value = result.data
        reset({
            report_date: value.report_date,
            order_product_id: { id: value.order_product_id, name: `${value.order_check_date} [${value.product_code}]${value.product_name} (在庫:${Number(Number(value.stock_cnt || 0).toFixed(2)).toLocaleString()}${value.unit})`, stock_cnt: value.stock_cnt, order_check_date: value.order_check_date, code: value.product_code },
            use_cnt: value.use_cnt,
            day_report_product_category_id: value.day_report_product_category_id,
            remarks: value.remarks,
            use_cnt_before: value.use_cnt,
        })
    }, [])
    const handleChangeError = useCallback(async (e: AxiosError) => {
        const htmlMessage = await getErrorMessage(e)
        setError(htmlMessage.split('<br/>').join("\n"))
    }, [setError])


    // OtherFunctions
    const getEditData = async () => {
        try {
            await ApiGetOpentime()
            if (props.index === "product") {
                await ApiGet(apiPath.dayreport.vDayRepProduct, `id/${urlParamsId}`, props.routeCat)
                    .then(response => handleChangeResetAsyncForm(response))
            }
        } catch (e: any) {
            handleChangeError(e)
        }
    }


    const handleClickDelete = async () => {
        setSubmitting(true)
        Swal.fire({
            title: '本当に非表示化してよろしいですか?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'はい (非表示化します)',
            denyButtonText: 'いいえ (キャンセルします)',
            confirmButtonColor: 'red',
            denyButtonColor: 'gray',
            icon: 'question',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let postPath = ""
                    if (props.index === "product") { postPath = apiPath.dayreport.dayRepProduct }
                    await ApiDelete(`${postPath}/${urlParamsId}`, editMode.opentime || "", props.routeCat)
                    await Swal.fire({
                        title: '非表示化完了',
                        html: `「No.${urlParamsId}」の非表示化が完了しました`,
                        timer: 5000,
                        icon: 'success'
                    })
                    navigate(`/${props.routePath}`, { replace: true })
                } catch (e: any) {
                    const htmlMessage = await getErrorMessage(e)
                    await Swal.fire({
                        title: '登録失敗',
                        html: htmlMessage,
                        //timer: 5000,
                        icon: 'error'
                    })
                }
            }
        })
        setSubmitting(false)
    }

    // onClick function
    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        setSubmitting(true)
        const datas: any = data
        Object.keys(datas).forEach(function (key) { if (datas[key] === "") { datas[key] = null } })
        const values = {
            id: urlParamsId || undefined,
            report_date: datas.report_date,
            order_product_id: datas.order_product_id?.id,
            use_cnt: datas.use_cnt,
            day_report_product_category_id: datas.day_report_product_category_id,
            remarks: datas.remarks,
        }
        // 日付チェック
        if (datas.order_product_id?.order_check_date > values.report_date) {
            await Swal.fire({
                title: '[使用日]以降に検品した[製品名]が選択されています',
                html: datas.day_report_menu_id?.name,
                //timer: 5000,
                icon: 'warning'
            })
            setSubmitting(false)
            return
        }

        if (Number(datas.order_product_id?.stock_cnt) < (Number(datas.use_cnt) - Number(datas.use_cnt_before))) {
            await Swal.fire({
                title: '使用数量 在庫数不備',
                html: `使用数量が在庫数量を下回っています。<br/>在庫数量:${Number(datas.order_product_id?.stock_cnt) + Number(datas.use_cnt_before) - Number(datas.use_cnt)}`,
                //timer: 5000,
                icon: 'warning'
            })
            setSubmitting(false)
            return
        }

        let postPath = ""
        if (props.index === "product") { postPath = apiPath.dayreport.dayRepProduct }
        if (props.routeMethod === "new") {
            try {
                const ret: any = await ApiPost(postPath, values, props.routeCat)
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
                await ApiPut(postPath, editMode.opentime || "", values, props.routeCat)
                await Swal.fire({
                    title: '更新完了',
                    html: `更新が完了しました`,
                    timer: 5000,
                    icon: 'success'
                })
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
                        <SelectBoxSearch
                            name={`order_product_id`} control={control} validationRule={validationRules.stateSearch} disabled={editMode.mode} disableClearable={true}
                            label={"製品名"} widthType={"full"} options={orderProducts} groupBy={"code"}
                        />
                    </div>
                    <div>
                        <TextInput
                            name="report_date" type={"date"} control={control} validationRule={validationRules.text} disabled={editMode.mode}
                            label={"使用日"} widthType={"xsmall"} rows={1} shrink={true}
                        />
                        <TextInput
                            name={`use_cnt`} type={"number"} control={control} validationRule={validationRules.numberDecimal10_2Signed} disabled={false}
                            label={"使用量"} widthType={"xsmall"} rows={1}
                        />
                    </div>
                    <div>
                        <SelectBox
                            name={`day_report_product_category_id`} control={control} validationRule={validationRules.state} disabled={false}
                            label={"使用理由"} widthType={"small"} options={reportCategorys}
                        />
                    </div>
                    <div>
                        <TextInput
                            name={`remarks`} type={"text"} control={control} validationRule={{}} disabled={false}
                            label={"備考"} widthType={"full"} rows={5}
                        />
                    </div>
                    <div className="module-spacer--medium" />
                    <div className="center">
                        <RouteGuardButton alert={true} roleCat={props.routeMethod === "new" ? "create" : "update"}>
                            <PrimaryButton label={props.routeMethod === "new" ? "新規登録 開始" : "情報更新 開始"} type="submit" disabled={submitting} onClick={() => { }} />
                        </RouteGuardButton>

                    </div>

                    {(editMode.mode && Number(getValues("use_cnt_before") || 999) === 0) && (
                        <div className="text-end">
                            <RouteGuardButton roleCat="delete" alert={false}>
                                <DeleteButton label="非表示" disabled={submitting} onClick={handleClickDelete} />
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


export const DayReportProductNew = (props: { index: string }) => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const routeMethod = arrPath.includes("edit") ? "edit" : arrPath.includes("new") ? "new" : "undefined"
    let menuName = ""
    let codeQuery = ""
    if (props.index === "product") { menuName = "製品"; codeQuery = searchParams.get('productCode') ? `&productCode=${searchParams.get('productCode')}` : `` }
    const routeCat = arrPath[1]
    const routePath = `${arrPath[1]}/${arrPath[2]}/${props.index}`
    const routePrm = `?${searchParams.get('s') ? `s=${searchParams.get('s')}` : ""}${searchParams.get('e') ? `&e=${searchParams.get('e')}` : ""}${codeQuery}`
    return (
        <PageLayoutNew cardTitle={`[${menuName}]使用日報 (在庫減少登録)`} cardSubTitle="[生産日報]製品管理" cardText="" routePath={`${routePath}${routePrm}`} routeMethod={routeMethod}>
            <CreateContent routeCat={routeCat} routeMethod={routeMethod} index={props.index} routePath={routePath} routePrm={routePrm} />
        </PageLayoutNew>
    )
};
