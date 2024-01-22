import { useCallback, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { PageLayoutAlert, ViewItemList } from '../../components';
import { CircularProgress } from '@mui/material';
// API imports
import { AxiosError } from "axios";
import { apiPath } from "../../config/authConfig";
import { ApiGet } from "../../utils/ApiCall";
import { getErrorMessage } from "../../utils/ErrorMessage";

// Msal imports
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

export const DashboardContentMain = (props: { dateStart: string, dateEnd: string, productCode: string }) => {
    const { inProgress } = useMsal();
    const [data, setData] = useState<{ columns: {}[], data: {}[] }>({ columns: [], data: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const location = useLocation();
    const arrPath = location.pathname.split("/")

    const handleChangeData = useCallback((result: any) => {
        for (let i in result.data) {
            result.data[i].product_page = <a href={`/${arrPath[1]}/order/edit/${result.data[i].order_product_id}`}>link</a>
        }
        setData({
            columns: [
                { title: 'id', field: 'id', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '使用日', field: 'report_date', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '管理コード', field: 'product_code', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '製品名', field: 'product_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '製品納品日', field: 'order_check_date', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '使用数量', field: 'use_cnt', cellStyle: { textAlign: 'right', fontSize: "medium" }, render: (e: any) => Number(e.use_cnt).toLocaleString() },
                { title: '単位', field: 'unit', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '原価', field: 'cost', cellStyle: { textAlign: 'right', fontSize: "medium" }, type: "currency", currencySetting: { currencyCode: 'JPY', minimumFractionDigits: 2, maximumFractionDigits: 2 } },
                { title: '税率', field: 'tax_par', cellStyle: { textAlign: 'center', fontSize: "medium" }, hidden: true },
                { title: '使用理由', field: 'day_report_product_category', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '取引先コード', field: 'supplier_code', cellStyle: { textAlign: 'left', fontSize: "medium" }, hidden: true },
                { title: '取引先名', field: 'supplier_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '科目カテゴリ', field: 'product_kamoku_category', cellStyle: { textAlign: 'center', fontSize: "medium" }, hidden: true },
                { title: 'カテゴリ1', field: 'product_category_1', cellStyle: { textAlign: 'left', fontSize: "medium" }, hidden: true },
                { title: 'カテゴリ2', field: 'product_category_2', cellStyle: { textAlign: 'left', fontSize: "medium" }, hidden: true },
                { title: 'カテゴリ3', field: 'product_category_3', cellStyle: { textAlign: 'left', fontSize: "medium" }, hidden: true },
                { title: '納品状況', field: 'order_product_status', cellStyle: { textAlign: 'left', fontSize: "medium" }, hidden: true },
                { title: '備考', field: 'remarks', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '登録日', field: 'created_at', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '更新日', field: 'updated_at', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '登録者', field: 'created_by', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '更新者', field: 'updated_by', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: "[リンク]仕入", field: 'product_page', cellStyle: { textAlign: 'center', fontSize: "medium" }, hidden: false },
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
            ApiGet(apiPath.dayreport.vDayRepProduct, `?s=${props.dateStart}&e=${props.dateEnd}&productCode=${String(props.productCode || "")}`, arrPath[1])
                .then(response => handleChangeData(response))
                .catch(e => handleChangeError(e));
        }
    }, [inProgress, handleChangeData, handleChangeError, props.dateStart, props.dateEnd, props.productCode]);

    if (error) {
        return (<PageLayoutAlert errMsg={error} />)
    }

    return <>
        {loading ?
            <div className="text-center + mt-3"><CircularProgress size={80} color="info" /></div>
            :
            <>
                <ViewItemList title={"使用日報(製品)一覧"} ViewData={data} isLoading={loading} query={`?s=${props.dateStart}&e=${props.dateEnd}&productCode=${String(props.productCode || "")}`} />
                <div className="text-end + me-3 + mt-2">
                </div>
            </>
        }
    </>;
};

