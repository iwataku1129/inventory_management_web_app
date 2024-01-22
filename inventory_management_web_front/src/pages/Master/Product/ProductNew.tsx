import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageLayoutAlert, PageLayoutNew, RouteGuardButton } from '../../../components';
import { TextInput, PrimaryButton, SelectBox, SelectBoxSearch } from '../../../UIkit';
import { validationRules } from "../../../config/validationConfig";
import { Alert, CircularProgress, Stack } from '@mui/material';
import Swal from 'sweetalert2'

import { useForm, SubmitHandler } from 'react-hook-form'
// API imports
import { AxiosError } from "axios";
import { apiPath } from "../../../config/authConfig";
import { ApiGet, ApiPost, ApiGetUnAuth } from "../../../utils/ApiCall";
import { getErrorMessage } from "../../../utils/ErrorMessage";

// Msal imports
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { BottomNavigationBarNew } from "../../../components/BottomNavigationBarNew";


const CreateContent = (props: { routeCat: string, routeMethod: string, routePath: string }) => {
    const urlParams = useParams<{ id: string }>()  // edit id
    const urlParamsId: number | undefined = Number(urlParams.id || undefined)
    const [editMode, setEditMode] = useState<{ mode: boolean, opentime: string | undefined }>({ mode: urlParamsId ? true : false, opentime: undefined });
    const [editOpt, setEditOpt] = useState<{ updateDisabled: boolean }>({ updateDisabled: false });
    const navigate = useNavigate()
    const { instance, inProgress } = useMsal();
    const [suppliers, setSupplier] = useState<{ id: number; name: string }[]>([]);
    const [kamokuCat, setKamokuCat] = useState<{ id: string | number; name: string }[]>([]);
    const [category1, setCategory1] = useState<{ id: string | number; name: string }[]>([]);
    const [category2, setCategory2] = useState<{ id: string | number; name: string }[]>([]);
    const [category3, setCategory3] = useState<{ id: string | number; name: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<String>("");

    type Inputs = {
        supplier_id: { id: number; name: string } | null,
        product_code: string
        product_name: string
        unit: string
        contents: number | ""
        ratio: number | ""
        remarks: string
        tax_par: number | ""
        product_kamoku_category_id: number | ''
        product_category_1_id: number | ''
        product_category_2_id: number | ''
        product_category_3_id: number | ''
    }

    const { control, handleSubmit, reset } = useForm<Inputs>({
        defaultValues: { supplier_id: null, product_code: "", product_name: "", unit: "個", contents: 1, ratio: 100, remarks: "", tax_par: 10, product_kamoku_category_id: "", product_category_1_id: "", product_category_2_id: "", product_category_3_id: "" }
    })

    // DidMount
    useEffect(() => {
        const getInitData = async () => {
            if (inProgress === InteractionStatus.None) {
                try {
                    await ApiGet(apiPath.master.vSupplier, ``, props.routeCat)
                        .then(response => handleChangeSuppliers(response))
                    await ApiGet(apiPath.master.vProductKamokuCat, ``, props.routeCat)
                        .then(response => handleChangeProductKamokuCat(response))
                    await ApiGet(apiPath.master.vProductCat1, ``, props.routeCat)
                        .then(response => handleChangeProductCat1(response))
                    await ApiGet(apiPath.master.vProductCat2, ``, props.routeCat)
                        .then(response => handleChangeProductCat2(response))
                    await ApiGet(apiPath.master.vProductCat3, ``, props.routeCat)
                        .then(response => handleChangeProductCat3(response))
                } catch (e: any) {
                    handleChangeError(e)
                }
            }
        }
        const getEditData = async () => {
            if (inProgress === InteractionStatus.None) {
                try {
                    await ApiGetOpentime()
                    await ApiGet(apiPath.master.vProductHist, `id/${urlParamsId}`, props.routeCat)
                        .then(response => handleChangeResetAsyncForm(response))
                } catch (e: any) {
                    handleChangeError(e)
                }
            }
        }

        const mainFunction = async () => {
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
        mainFunction()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlParamsId, props.routeMethod, inProgress, instance]);

    // Change CallBackFunctions
    const handleChangeSuppliers = useCallback((result: any) => {
        const tmp = result.data.map((value: { id: number, supplier_code: string, supplier_name: string }) => {
            return { id: value.id, name: `${value.supplier_name} (${value.supplier_code})` }
        })
        setSupplier(tmp)
    }, [setSupplier]);
    const handleChangeProductKamokuCat = useCallback((result: any) => {
        const tmp = result.data.map((value: { id: number, product_kamoku_category: string }) => {
            return { id: value.id, name: `${value.product_kamoku_category}` }
        })
        setKamokuCat(tmp)
    }, [setKamokuCat]);
    const handleChangeProductCat1 = useCallback((result: any) => {
        const tmp = result.data.map((value: { id: number, product_category_1: string }) => {
            return { id: value.id, name: `${value.product_category_1}` }
        })
        setCategory1(tmp)
    }, [setCategory1]);
    const handleChangeProductCat2 = useCallback((result: any) => {
        const tmp = result.data.map((value: { id: number, product_category_2: string }) => {
            return { id: value.id, name: `${value.product_category_2}` }
        })
        setCategory2(tmp)
    }, [setCategory2]);
    const handleChangeProductCat3 = useCallback((result: any) => {
        const tmp = result.data.map((value: { id: number, product_category_3: string }) => {
            return { id: value.id, name: `${value.product_category_3}` }
        })
        setCategory3(tmp)
    }, [setCategory3]);
    const handleChangeResetAsyncForm = useCallback((result: any) => {
        Object.keys(result.data).forEach(function (key) { if (result.data[key] === null) { result.data[key] = "" } })
        const value = result.data
        reset({
            supplier_id: { id: value.supplier_id, name: `${value.supplier_name} (${value.supplier_code})` },
            product_code: value.product_code,
            product_name: value.product_name,
            unit: value.unit,
            contents: value.contents,
            ratio: value.ratio,
            remarks: value.remarks,
            tax_par: value.tax_par,
            product_kamoku_category_id: value.product_kamoku_category_id,
            product_category_1_id: value.product_category_1_id,
            product_category_2_id: value.product_category_2_id,
            product_category_3_id: value.product_category_3_id,
        });
        setSubmitting(value.product_id_now === urlParamsId ? false : true)
        setEditOpt({ updateDisabled: value.product_id_now === urlParamsId ? false : true })
    }, [reset]);
    const handleChangeCurrentDt = useCallback((result: any) => {
        setEditMode({ ...editMode, "mode": true, "opentime": result.data })
    }, [editMode]);
    const handleChangeError = useCallback(async (e: AxiosError) => {
        const htmlMessage = await getErrorMessage(e)
        setError(htmlMessage.split('<br/>').join("\n"))
    }, [setError])

    // OtherFunctions
    const ApiGetOpentime = async () => {
        await ApiGetUnAuth("/current")
            .then(response => handleChangeCurrentDt(response))
            .catch(e => handleChangeError(e))
    }

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        setSubmitting(true)
        const datas: any = data
        Object.keys(datas).forEach(function (key) { if (datas[key] === "") { datas[key] = null } })
        const values = {
            id: urlParamsId || undefined,
            supplier_id: datas.supplier_id?.id,
            product_code: datas.product_code,
            product_name: datas.product_name,
            unit: datas.unit,
            contents: datas.contents,
            ratio: datas.ratio,
            remarks: datas.remarks,
            tax_par: datas.tax_par,
            product_kamoku_category_id: datas.product_kamoku_category_id,
            product_category_1_id: datas.product_category_1_id,
            product_category_2_id: datas.product_category_2_id,
            product_category_3_id: datas.product_category_3_id,
        }

        // 重複チェック
        if (props.routeMethod === "new") {
            const ret: any = await ApiGet(apiPath.master.vProductNow, `product_code/${values.product_code}`, props.routeCat)
                .then(response => response)
                .catch(e => handleChangeError(e));
            if (ret.data) {
                await Swal.fire({
                    title: '登録失敗',
                    html: "製品管理コードが既に登録されています",
                    //timer: 5000,
                    icon: 'error'
                })
                setSubmitting(false)
                return
            }
        }

        // 登録開始
        try {
            const ret: any = await ApiPost(apiPath.master.productNow, values, props.routeCat)
            await Swal.fire({
                title: '登録完了',
                html: `「${values.product_name}」の登録が完了しました`,
                timer: 5000,
                icon: 'success'
            })
            navigate(`/${props.routePath}/edit/${ret.data.product_id}`, { replace: true })
        } catch (e: any) {
            const htmlMessage = await getErrorMessage(e)
            await Swal.fire({
                title: '登録失敗',
                html: htmlMessage,
                //timer: 5000,
                icon: 'error'
            })
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
                        <TextInput
                            name="product_code" type={"text"} control={control} validationRule={validationRules.textLen4} disabled={editMode.mode}
                            label={"製品管理コード"} widthType={"small"} rows={1}
                        />
                        <TextInput
                            name="product_name" type={"text"} control={control} validationRule={validationRules.text} disabled={false}
                            label={"製品名"} widthType={"small"} rows={1}
                        />
                        <SelectBoxSearch
                            name="supplier_id" control={control} validationRule={validationRules.stateSearch} disabled={editMode.mode} disableClearable={true}
                            label={"取引先名"} widthType={"small"} options={suppliers}
                        />
                    </div>
                    <div>
                        <TextInput
                            name="contents" type={"number"} control={control} validationRule={validationRules.numberDecimal10_2Unsigned} disabled={false}
                            label={"質量"} widthType={"xsmall"} rows={1}
                        />
                        <TextInput
                            name="unit" type={"text"} control={control} validationRule={validationRules.text} disabled={editMode.mode}
                            label={"単位"} widthType={"xsmall"} rows={1}
                        />
                        <TextInput
                            name="ratio" type={"number"} control={control} validationRule={validationRules.numberPer} disabled={false}
                            label={"部歩率(%)"} widthType={"xsmall"} rows={1}
                        />
                        <SelectBox
                            name="tax_par" control={control} validationRule={validationRules.state} disabled={editMode.mode}
                            label={"税率(%)"} widthType={"xsmall"} options={[{ id: 8, name: "8" }, { id: 10, name: "10" }]}
                        />
                    </div>
                    <div>
                        <TextInput
                            name="remarks" type={"text"} control={control} validationRule={{}} disabled={false}
                            label={"備考"} widthType={"full"} rows={3}
                        />
                    </div>
                    <div>
                        <div>
                            <SelectBox
                                name="product_kamoku_category_id" control={control} validationRule={{}} disabled={editMode.mode}
                                label={"科目カテゴリ"} widthType={"small"} options={kamokuCat}
                            />
                        </div>
                        <div>
                            <SelectBox
                                name="product_category_1_id" control={control} validationRule={{}} disabled={false}
                                label={"製品カテゴリ1"} widthType={"small"} options={category1}
                            />
                            <SelectBox
                                name="product_category_2_id" control={control} validationRule={{}} disabled={false}
                                label={"製品カテゴリ2"} widthType={"small"} options={category2}
                            />
                            <SelectBox
                                name="product_category_3_id" control={control} validationRule={{}} disabled={false}
                                label={"製品カテゴリ3"} widthType={"small"} options={category3}
                            />
                        </div>
                    </div>

                    <div className="module-spacer--medium" />
                    <div className="center">
                        <RouteGuardButton alert={true} roleCat={props.routeMethod === "new" ? "create" : "update"}>
                            {(() => {
                                if (editOpt.updateDisabled === false) {
                                    return (<>
                                        <PrimaryButton label={props.routeMethod === "new" ? "新規登録 開始" : "情報更新 開始"} type="submit" disabled={submitting} onClick={() => { }} /></>
                                    )
                                } else {
                                    return (
                                        <><Alert severity="warning">過去Versionの変更はできません</Alert></>)
                                }
                            })()}
                        </RouteGuardButton>
                    </div>
                    <BottomNavigationBarNew
                        topPageQuery={`/${props.routePath}`}
                        newPageQuery={`/${props.routePath}/new`}
                        routeMethod={props.routeMethod}
                    />
                </Stack>
            }
        </>
    )
};


export const ProductNew = (props: { index: string }) => {
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const routeMethod = arrPath.includes("edit") ? "edit" : arrPath.includes("new") ? "new" : "undefined"
    const routeCat = arrPath[1]
    const routePath = `${arrPath[1]}/${arrPath[2]}/${arrPath[3]}/${props.index}`
    return (
        <PageLayoutNew cardTitle="製品管理" cardSubTitle="マスタ管理" cardText="" routePath={routePath} routeMethod={routeMethod}>
            <CreateContent routeCat={routeCat} routeMethod={routeMethod} routePath={routePath} />
        </PageLayoutNew>
    )
};
