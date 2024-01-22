import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageLayoutAlert, PageLayoutNew, RouteGuardButton } from '../../../components';
import { TextInput, PrimaryButton, DeleteButton, AddButton } from '../../../UIkit';
import { validationRules } from "../../../config/validationConfig";
import { CircularProgress, Stack } from '@mui/material';
import Swal from 'sweetalert2'

import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
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
    const navigate = useNavigate()
    const { instance, inProgress } = useMsal();
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<String>("");

    type Inputs = {
        inventory_category: string
        inventory_category_path: string
        users: { id: number | null, user_name: string, email: string, editFlg: boolean }[]
    }

    const { control, handleSubmit, reset } = useForm<Inputs>({
        defaultValues: { inventory_category: "", inventory_category_path: "", users: [] }
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'users'
    });

    // DidMount
    useEffect(() => {
        const mainFunction = async () => {
            if (props.routeMethod === "new") {
                setLoading(false)    // 取得中でもState更新
            } else {
                setLoading(true)
                await getEditData()
                setLoading(false)
            }
        }
        mainFunction()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlParamsId, props.routeMethod, inProgress, instance]);

    // Change CallBackFunctions
    const handleChangeResetAsyncForm = useCallback((result: any, users: any) => {
        const userTmp = users.data.map((value: any) => {
            return { id: value.id, user_name: value.user_name, email: value.email, editFlg: true }
        })
        reset({ inventory_category: result.data.inventory_category, inventory_category_path: result.data.inventory_category_path, users: userTmp });
    }, [reset]);
    const handleChangeCurrentDt = useCallback((result: any) => {
        setEditMode({ ...editMode, "mode": true, "opentime": result.data })
    }, [editMode]);
    const handleChangeError = useCallback(async (e: AxiosError) => {
        const htmlMessage = await getErrorMessage(e)
        setError(htmlMessage.split('<br/>').join("\n"))
    }, [setError])

    // OtherFunctions
    const getEditData = async () => {
        if (inProgress === InteractionStatus.None) {
            try {
                await ApiGetOpentime()
                const cat = await ApiGet(apiPath.master.vInventCategory, `id/${urlParamsId}`, props.routeCat)
                const user = await ApiGet(apiPath.master.vUser, `inv_path/${cat?.data.inventory_category_path}`, props.routeCat)
                handleChangeResetAsyncForm(cat, user)
            } catch (e: any) {
                handleChangeError(e)
            }
        }
    }
    const ApiGetOpentime = async () => {
        await ApiGetUnAuth("/current")
            .then(response => handleChangeCurrentDt(response))
            .catch(e => handleChangeError(e))
    }

    // onClick function
    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        setSubmitting(true)
        const datas: any = data
        Object.keys(datas).forEach(function (key) { if (datas[key] === "") { datas[key] = null } })
        const values1 = {
            inventory_category: datas.inventory_category,
            inventory_category_path: datas.inventory_category_path,
        }
        let id: number = urlParamsId
        let reloadFlg: boolean = false
        try {
            if (props.routeMethod === "new") {
                const ret: any = await ApiPost(apiPath.master.inventCategory, values1, props.routeCat)
                id = ret.data.id
            }
            for (let i = 0; i < datas.users.length; i++) {
                if (!datas.users[i].editFlg) {
                    const values2 = {
                        id: datas.users[i].id,
                        user_name: datas.users[i].user_name,
                        email: datas.users[i].email,
                    }
                    await ApiPost(`${apiPath.master.userInvPath}/${values1.inventory_category_path}`, values2, props.routeCat)
                }
            }
            await Swal.fire({
                title: '登録完了',
                html: `「${values1.inventory_category}」の登録が完了しました`,
                timer: 5000,
                icon: 'success'
            })
            if (props.routeMethod !== "new") {
                reloadFlg = true
            }
        } catch (e: any) {
            const htmlMessage = await getErrorMessage(e)
            await Swal.fire({
                title: '登録失敗',
                html: htmlMessage,
                //timer: 5000,
                icon: 'error'
            })
        }
        if (id) {
            navigate(`/${props.routePath}/edit/${id}`, { replace: true })
            if (reloadFlg) { getEditData() }
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
                            name="inventory_category" type={"text"} control={control} validationRule={validationRules.text} disabled={editMode.mode}
                            label={`ページ名`} widthType={"small"} rows={1}
                        />
                        <TextInput
                            name="inventory_category_path" type={"text"} control={control} validationRule={validationRules.engIower} disabled={editMode.mode}
                            label={`path(小英字)`} widthType={"small"} rows={1}
                        />
                    </div>
                    <div className="module-spacer--medium" />
                    {fields.map((field: any, index: number) => (
                        <div key={field.id}>
                            <label>{index + 1}：</label>
                            <TextInput
                                name={`users[${index}].user_name`} type={"text"} control={control} validationRule={validationRules.text} disabled={field.editFlg}
                                label={"ユーザ名"} widthType={"small"} rows={1}
                            />
                            <TextInput
                                name={`users[${index}].email`} type={"text"} control={control} validationRule={validationRules.email} disabled={field.editFlg}
                                label={"メールアドレス"} widthType={"small"} rows={1}
                            />
                            <DeleteButton label=" " onClick={() => remove(index)} disabled={field.editFlg} />
                        </div>
                    ))}
                    <div className="center">
                        <AddButton label={"ユーザ追加"} onClick={() => append({ id: null, user_name: "", email: "", editFlg: false })} />
                    </div>

                    <div className="module-spacer--medium" />
                    <div className="center">
                        <RouteGuardButton alert={true} roleCat={props.routeMethod === "new" ? "create" : "update"}>
                            <PrimaryButton label={props.routeMethod === "new" ? "新規登録 開始" : "情報更新 開始"} type="submit" disabled={submitting} onClick={() => { }} />
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

export const PageNew = (props: { index: string }) => {
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const routeMethod = arrPath.includes("edit") ? "edit" : arrPath.includes("new") ? "new" : "undefined"
    const routeCat = arrPath[1]
    const routePath = `${arrPath[1]}/${props.index}`

    return (
        <PageLayoutNew cardTitle={`ページ管理`} cardSubTitle="管理ページ" cardText="" routePath={routePath} routeMethod={routeMethod}>
            <CreateContent routeCat={routeCat} routeMethod={routeMethod} routePath={routePath} />
        </PageLayoutNew>
    )
};
