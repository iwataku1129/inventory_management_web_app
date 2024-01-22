import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageLayoutAlert, PageLayoutNew, RouteGuardButton } from '../../../components';
import { DeleteButton, TextInput, PrimaryButton } from '../../../UIkit';
import { validationRules } from "../../../config/validationConfig";
import { CircularProgress, Stack } from '@mui/material';
import Swal from 'sweetalert2'

import { useForm, SubmitHandler } from 'react-hook-form'
// API imports
import { AxiosError } from "axios";
import { apiPath } from "../../../config/authConfig";
import { ApiGet, ApiPost, ApiPut, ApiDelete, ApiGetUnAuth } from "../../../utils/ApiCall";
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
        user_name: string
        email: string
    }

    const { control, handleSubmit, reset } = useForm<Inputs>({
        defaultValues: { user_name: "", email: "" }
    })

    // DidMount
    useEffect(() => {
        const getEditData = async () => {
            if (inProgress === InteractionStatus.None) {
                try {
                    await ApiGetOpentime()
                    await ApiGet(apiPath.master.user, `id/${urlParamsId}`, props.routeCat)
                        .then(response => handleChangeResetAsyncForm(response))
                } catch (e: any) {
                    handleChangeError(e)
                }
            }
        }
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
    const handleChangeResetAsyncForm = useCallback((result: any) => {
        reset({ user_name: result.data.user_name, email: result.data.email });
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

    // onClick function
    const handleClickDeleteButton = async () => {
        setSubmitting(true)
        Swal.fire({
            title: '本当に削除してよろしいですか?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'はい (削除します)',
            denyButtonText: 'いいえ (キャンセルします)',
            confirmButtonColor: 'red',
            denyButtonColor: 'gray',
            icon: 'question',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await ApiDelete(`${apiPath.master.user}/${urlParamsId}`, editMode.opentime || "", props.routeCat)
                    await Swal.fire({
                        title: '削除完了',
                        html: `「No.${urlParamsId}」の削除が完了しました`,
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

    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
        setSubmitting(true)
        const datas: any = data
        Object.keys(datas).forEach(function (key) { if (datas[key] === "") { datas[key] = null } })
        const values = {
            id: urlParamsId || undefined,
            user_name: datas.user_name,
            email: datas.email,
        }

        if (props.routeMethod === "new") {
            try {
                const ret: any = await ApiPost(apiPath.master.user, values, props.routeCat)
                await Swal.fire({
                    title: '登録完了',
                    html: `「${datas.email}」の登録が完了しました`,
                    timer: 5000,
                    icon: 'success'
                })
                navigate(`/${props.routePath}/edit/${ret.data.id}`, { replace: true })
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
                await ApiPut(apiPath.master.user, editMode.opentime || "", values, props.routeCat)
                await Swal.fire({
                    title: '更新完了',
                    html: `「${datas.email}」の更新が完了しました`,
                    timer: 5000,
                    icon: 'success'
                })
                await ApiGetOpentime()  // opentime更新
                navigate(`/${props.routePath}/edit/${urlParamsId}`, { replace: true })
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
                        <TextInput
                            name="user_name" type={"text"} control={control} validationRule={validationRules.text} disabled={false}
                            label={`ユーザ名`} widthType={"small"} rows={1}
                        />
                        <TextInput
                            name="email" type={"text"} control={control} validationRule={validationRules.email} disabled={editMode.mode}
                            label={`メールアドレス`} widthType={"small"} rows={1}
                        />
                    </div>

                    <div className="module-spacer--medium" />
                    <div className="center">
                        <RouteGuardButton alert={true} roleCat={props.routeMethod === "new" ? "create" : "update"}>
                            <PrimaryButton label={props.routeMethod === "new" ? "新規登録 開始" : "情報更新 開始"} type="submit" disabled={submitting} onClick={() => { }} />
                        </RouteGuardButton>
                    </div>

                    {editMode.mode ?
                        <div className="mt-3 + text-end">
                            <RouteGuardButton alert={false} roleCat={"delete"}>
                                <DeleteButton disabled={submitting} onClick={handleClickDeleteButton} />
                            </RouteGuardButton>
                        </div>
                        : <></>
                    }
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

export const UserNew = (props: { index: string }) => {
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const routeMethod = arrPath.includes("edit") ? "edit" : arrPath.includes("new") ? "new" : "undefined"
    const routeCat = arrPath[1]
    const routePath = `${arrPath[1]}/${arrPath[2]}/${props.index}`

    return (
        <PageLayoutNew cardTitle={`ユーザ管理`} cardSubTitle="管理ページ" cardText="" routePath={routePath} routeMethod={routeMethod}>
            <CreateContent routeCat={routeCat} routeMethod={routeMethod} routePath={routePath} />
        </PageLayoutNew>
    )
};
