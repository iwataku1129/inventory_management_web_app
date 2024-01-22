import { useCallback, useEffect, useState } from "react";
import { useLocation, useSearchParams } from 'react-router-dom';
import { PageLayoutAlert, PageLayoutMain, ViewItemList } from '../../components';
import { CircularProgress, Stack, Grid, ButtonGroup, Button } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextInput, SearchButton, SelectBoxSearch } from '../../UIkit';
import { validationRules } from "../../config/validationConfig";
import moment from 'moment'
// API imports
import { AxiosError } from "axios";
import { apiPath } from "../../config/authConfig";
import { ApiGet } from "../../utils/ApiCall";
import { getErrorMessage } from "../../utils/ErrorMessage";

// Msal imports
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

const DashboardContentMain = (props: { date: string, productCode: string }) => {
    const { inProgress } = useMsal();
    const [data, setData] = useState<{ columns: {}[], data: {}[] }>({ columns: [], data: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<String>("");
    const location = useLocation();
    const arrPath = location.pathname.split("/")

    const handleChangeData = useCallback((result: any) => {
        setData({
            columns: [
                { title: '取引id', field: 'id', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '納品日 (予定含)', field: 'deliver_date', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '状況', field: 'order_product_status', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '管理コード', field: 'product_code', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '製品名', field: 'product_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '取引先名', field: 'supplier_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '検品数量', field: 'order_check_cnt_unit', cellStyle: { textAlign: 'right', fontSize: "medium" }, render: (e: any) => Number(e.order_check_cnt_unit).toLocaleString() },
                { title: '在庫数量', field: 'stock_cnt', cellStyle: { textAlign: 'right', fontSize: "medium" }, render: (e: any) => Number(e.stock_cnt).toLocaleString() },
                { title: '単位', field: 'unit', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '在庫額(円)', field: 'stock_price', cellStyle: { textAlign: 'right', fontSize: "medium" }, type: "currency", currencySetting: { currencyCode: 'JPY', minimumFractionDigits: 2, maximumFractionDigits: 2 } },
                { title: '[使用量]製品', field: 'use_cnt', cellStyle: { textAlign: 'right', fontSize: "medium" }, render: (e: any) => Number(e.use_cnt).toLocaleString() },
                //{ title: '仕入額', field: 'order_price', cellStyle: { textAlign: 'right', fontSize: "medium" }, type: "currency", currencySetting: { currencyCode: 'JPY', minimumFractionDigits: 2, maximumFractionDigits: 2 } },
                { title: '科目', field: 'product_kamoku_category', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: 'カテゴリ1', field: 'product_category_1', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: 'カテゴリ2', field: 'product_category_2', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: 'カテゴリ3', field: 'product_category_3', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                //{ title: '発注日', field: 'order_date', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                //{ title: '検品日', field: 'order_check_date', cellStyle: { textAlign: 'left', fontSize: "medium" } },
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
            ApiGet(apiPath.stock.vReportStockProduct, `query?date=${props.date}&productCode=${String(props.productCode || "")}`, arrPath[1])
                .then(response => handleChangeData(response))
                .catch(e => handleChangeError(e));
        }
    }, [inProgress, props.date, props.productCode, handleChangeData, handleChangeError]);

    if (error) {
        return (<PageLayoutAlert errMsg={error} />)
    }

    return <>
        {loading ?
            <div className="text-center + mt-3"><CircularProgress size={80} color="info" /></div>
            :
            <ViewItemList title={"[在庫]製品 (取引ID別)"} ViewData={data} isLoading={loading} disableActionButton={true} />
        }
    </>;
};
const DashboardContentProductCodeMain = (props: { date: string, productCode: string }) => {
    const { inProgress } = useMsal();
    const [data, setData] = useState<{ columns: {}[], data: {}[] }>({ columns: [], data: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<String>("");
    const location = useLocation();
    const arrPath = location.pathname.split("/")

    const handleChangeData = useCallback((result: any) => {
        let ret: {}[] = []
        for (let i = 0; i < result.data.length; i++) {
            if (Number(result.data[i].stock_cnt) !== 0) {
                ret.push({ ...result.data[i], id: Number(i || 0) + 1 })
            }
        }
        setData({
            columns: [
                //{ title: 'No', field: 'id', cellStyle: { textAlign: 'center', fontSize: "medium" }, hidden: true },   // unique key用
                { title: '管理コード', field: 'product_code', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '製品名', field: 'product_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '取引先名', field: 'supplier_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '検品数量', field: 'order_check_cnt_unit', cellStyle: { textAlign: 'right', fontSize: "medium" }, render: (e: any) => Number(e.order_check_cnt_unit).toLocaleString() },
                { title: '在庫数量', field: 'stock_cnt', cellStyle: { textAlign: 'right', fontSize: "medium" }, render: (e: any) => Number(e.stock_cnt).toLocaleString(), },
                { title: '単位', field: 'unit', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '在庫額(円)', field: 'stock_price', cellStyle: { textAlign: 'right', fontSize: "medium" }, type: "currency", currencySetting: { currencyCode: 'JPY', minimumFractionDigits: 2, maximumFractionDigits: 2 } },
                { title: '税率', field: 'tax_par', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '[使用量]製品', field: 'use_cnt', cellStyle: { textAlign: 'right', fontSize: "medium" }, render: (e: any) => Number(e.use_cnt).toLocaleString() },
                { title: '科目カテゴリ', field: 'product_kamoku_category', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: 'カテゴリ1', field: 'product_category_1', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: 'カテゴリ2', field: 'product_category_2', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: 'カテゴリ3', field: 'product_category_3', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '製品id', field: 'product_ids', cellStyle: { textAlign: 'left', fontSize: "medium" } },
            ],
            data: ret || [],
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
            ApiGet(apiPath.stock.vReportStockProductGroup, `query?date=${props.date}&productCode=${String(props.productCode || "")}`, arrPath[1])
                .then(response => handleChangeData(response))
                .catch(e => handleChangeError(e));
        }
    }, [inProgress, props.date, props.productCode, handleChangeData, handleChangeError]);

    if (error) {
        return (<PageLayoutAlert errMsg={error} />)
    }

    return <>
        {loading ?
            <div className="text-center + mt-3"><CircularProgress size={80} color="info" /></div>
            :
            <ViewItemList title={"[在庫]製品 (製品コード別)"} ViewData={data} isLoading={loading} disableActionButton={true} />
        }
    </>;
};

export const StockReportProductMain = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    type Inputs = {
        date: string
        productCode: { id: string, name: string } | null
    }
    const [query, setQuery] = useState<Inputs>({ date: searchParams.get('date') || moment().add(0, 'months').format("yyyy-MM-DD"), productCode: searchParams.get('productCode') ? { id: searchParams.get('productCode') || "", name: searchParams.get('productCode') || "" } : null });
    const [products, setProducts] = useState<{ id: string | number; name: string }[]>([]);
    const [pageId, setPageId] = useState<0 | 1 | 2>(0)
    const { instance, inProgress } = useMsal();
    const location = useLocation();
    const arrPath = location.pathname.split("/")

    // DidMount
    useEffect(() => {
        const getProducts = () => {
            if (products.length === 0 && inProgress === InteractionStatus.None) {
                ApiGet(apiPath.master.vProductNow, ``, arrPath[1])
                    .then(response => handleChangeProductData(response))
                //.catch(e => handleChangeError(e));
            }
        }
        getProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inProgress, instance])

    // Change CallBackFunctions
    const handleChangeProductData = useCallback((result: any) => {
        const tmp = result.data.map((value: { product_code: string, product_name: string }) => {
            return { id: value.product_code, name: `${value.product_name} (${value.product_code})` }
        })
        setProducts(tmp)
    }, [setProducts])
    const OptionLayout = () => {
        const { control, handleSubmit } = useForm<Inputs>({
            defaultValues: { date: query.date, productCode: query.productCode }
        })
        const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
            setQuery({ ...query, "date": data.date, "productCode": data.productCode })
            setSearchParams({ date: data.date, productCode: data.productCode?.id || "" }, { replace: true })
        }

        return (
            <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container style={{ "alignItems": "center" }}>
                    <Grid item>
                        <TextInput
                            name="date" type={"date"} control={control} validationRule={validationRules.text} disabled={false}
                            label={"適用日"} widthType={"xsmall"} rows={1}
                        />
                    </Grid>
                    <Grid item className="me-2">
                        <SelectBoxSearch
                            name={`productCode`} control={control} validationRule={{}} disabled={false} disableClearable={false}
                            label={"製品名 (ワイルドカード検索)"} widthType={"half"} options={products}
                        />
                    </Grid>
                </Grid>
                <Grid className="ms-2" container style={{ "alignItems": "center" }}>
                    <Grid item xs="auto">
                        <SearchButton type="submit" disabled={false} />
                    </Grid>
                    <Grid item xs className="text-end">
                        <ButtonGroup variant="text" aria-label="text button group">
                            <Button onClick={() => setPageId(0)}>製品コード別</Button>
                            <Button onClick={() => setPageId(1)}>取引ID別</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Stack>
        )
    }

    return (
        <PageLayoutMain cardTitle="[在庫]製品" cardSubTitle="在庫サマリ" cardText="" viewOnlyFlg={true} optionLayout={<OptionLayout />}>

            {(() => {
                if (pageId === 0) {
                    return (<DashboardContentProductCodeMain date={query.date} productCode={query.productCode?.id || ""} />)
                } else if (pageId === 1) {
                    return (<DashboardContentMain date={query.date} productCode={query.productCode?.id || ""} />)
                }
            })()}
        </PageLayoutMain>
    )
};
