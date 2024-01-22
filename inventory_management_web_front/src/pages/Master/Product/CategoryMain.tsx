import { useCallback, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { PageLayoutAlert, ViewItemList } from '../../../components';
import { CircularProgress } from '@mui/material';
// API imports
import { AxiosError } from "axios";
import { apiPath } from "../../../config/authConfig";
import { ApiGet } from "../../../utils/ApiCall";
import { getErrorMessage } from "../../../utils/ErrorMessage";

// Msal imports
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

export const DashboardContentCategoryMain = (props: { index: string }) => {
    const { inProgress } = useMsal();
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const [data, setData] = useState<{ columns: {}[], data: {}[] }>({ columns: [], data: [] });
    const [indexLabel, setIndexLabel] = useState<{ title: string, field: string, api: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<String>("");

    useEffect(() => {
        if (props.index === "kamoku_cat") {
            setIndexLabel({ title: "科目", field: "product_kamoku_category", api: apiPath.master.vProductKamokuCat || "" })
        } else if (props.index === "cat1") {
            setIndexLabel({ title: "製品カテゴリ1", field: "product_category_1", api: apiPath.master.vProductCat1 || "" })
        } else if (props.index === "cat2") {
            setIndexLabel({ title: "製品カテゴリ2", field: "product_category_2", api: apiPath.master.vProductCat2 || "" })
        } else if (props.index === "cat3") {
            setIndexLabel({ title: "製品カテゴリ3", field: "product_category_3", api: apiPath.master.vProductCat3 || "" })
        }
    }, [props.index])

    const handleChangeData = useCallback((result: any, title: string, field: string) => {
        setData({
            columns: [
                { title: 'id', field: 'id', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: title, field: field, cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '登録日', field: 'created_at', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '更新日', field: 'updated_at', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '登録者', field: 'created_by', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '更新者', field: 'updated_by', cellStyle: { textAlign: 'left', fontSize: "medium" } },
            ],
            data: result.data,
        })
        setLoading(false)
    }, [setData, setLoading])

    const handleChangeError = useCallback(async (e: AxiosError) => {
        const htmlMessage = await getErrorMessage(e)
        setError(htmlMessage.split('<br/>').join("\n"))
    }, [setError])

    useEffect(() => {
        setLoading(true)
        if (inProgress === InteractionStatus.None && indexLabel?.api) {
            ApiGet(indexLabel?.api || "", ``, arrPath[1])
                .then(response => handleChangeData(response, indexLabel?.title, indexLabel?.field))
                .catch(e => handleChangeError(e));
        }
    }, [indexLabel, inProgress, handleChangeData, handleChangeError]);

    if (error) {
        return (<PageLayoutAlert errMsg={error} />)
    }

    return <>
        {loading ?
            <div className="text-center + mt-3"><CircularProgress size={80} color="info" /></div>
            :
            <ViewItemList title={`カテゴリ一覧 (${indexLabel?.title})`} ViewData={data} isLoading={loading} />
        }
    </>;
};
