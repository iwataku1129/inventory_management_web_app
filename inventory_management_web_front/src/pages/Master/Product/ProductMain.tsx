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

export const DashboardContentProductMain = () => {
    const { inProgress } = useMsal();
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const [data, setData] = useState<{ columns: {}[], data: {}[] }>({ columns: [], data: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<String>("");

    const handleChangeData = useCallback((result: any) => {
        setData({
            columns: [
                { title: 'id', field: 'id', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '管理コード', field: 'product_code', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '製品名', field: 'product_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '取引先コード', field: 'supplier_code', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '取引先名', field: 'supplier_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '質量', field: 'contents', cellStyle: { textAlign: 'right', fontSize: "medium" }, render: (e: any) => Number(e.contents).toLocaleString() },
                { title: '単位', field: 'unit', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '部歩率(%)', field: 'ratio', cellStyle: { textAlign: 'right', fontSize: "medium" } },
                { title: '備考', field: 'remarks', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '消費税率', field: 'tax_par', cellStyle: { textAlign: 'right', fontSize: "medium" } },
                { title: '科目カテゴリ', field: 'product_kamoku_category', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: 'カテゴリ1', field: 'product_category_1', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: 'カテゴリ2', field: 'product_category_2', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: 'カテゴリ3', field: 'product_category_3', cellStyle: { textAlign: 'left', fontSize: "medium" } },
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
        if (inProgress === InteractionStatus.None) {
            ApiGet(apiPath.master.vProductNow, ``, arrPath[1])
                .then(response => handleChangeData(response))
                .catch(e => handleChangeError(e));
        }
    }, [inProgress, handleChangeData, handleChangeError]);

    if (error) {
        return (<PageLayoutAlert errMsg={error} />)
    }

    return <>
        {loading ?
            <div className="text-center + mt-3"><CircularProgress size={80} color="info" /></div>
            :
            <ViewItemList title={"製品一覧"} ViewData={data} isLoading={loading} />
        }
    </>;
};
