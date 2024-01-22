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

export const DashboardContentSupplierMonthMain = (props: { month: string, notCompflg: boolean, supplierCode: string }) => {
    const { inProgress } = useMsal();
    const [data, setData] = useState<{ columns: {}[], data: {}[] }>({ columns: [], data: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const location = useLocation();
    const arrPath = location.pathname.split("/")

    const handleChangeData = useCallback((result: any) => {
        setData({
            columns: [
                //{ title: 'id', field: 'id', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '納品月 (予定含)', field: 'deliver_month', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '状況', field: 'order_product_status', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                //{ title: 'Phase', field: 'material_order_phase', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '取引先名', field: 'supplier_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                //{ title: '質量', field: 'contents', cellStyle: { textAlign: 'right', fontSize: "medium" } },
                //{ title: '部歩率(%)', field: 'ratio', cellStyle: { textAlign: 'right', fontSize: "medium" } },
                { title: '仕入額 (税抜)', field: 'order_price', cellStyle: { textAlign: 'right', fontSize: "medium" }, type: "currency", currencySetting: { currencyCode: 'JPY', minimumFractionDigits: 0, maximumFractionDigits: 0 } },
                { title: '消費税率', field: 'tax_par', cellStyle: { textAlign: 'right', fontSize: "medium" } },
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
            ApiGet(apiPath.order.vOrderProductSupplierMonth, `?month=${props.month}&notCompflg=${props.notCompflg ? "1" : "0"}&supplierCode=${String(props.supplierCode || "")}`, arrPath[1])
                .then(response => handleChangeData(response))
                .catch(e => handleChangeError(e));
        }
    }, [inProgress, handleChangeData, handleChangeError, props.month, props.notCompflg, props.supplierCode]);

    if (error) {
        return (<PageLayoutAlert errMsg={error} />)
    }

    return <>
        {loading ?
            <div className="text-center + mt-3"><CircularProgress size={80} color="info" /></div>
            :
            <>
                <ViewItemList title={"[月別]仕入・納品一覧(取引先)"} disableActionButton={true} ViewData={data} isLoading={loading} query={`?month=${props.month}&notCompflg=${props.notCompflg ? "1" : "0"}&supplierCode=${String(props.supplierCode || "")}`} />
                <div className="text-end + me-3 + mt-2">
                </div>
            </>
        }
    </>;
};

