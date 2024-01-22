import { useCallback, useEffect, useState } from "react";
import { useLocation, useSearchParams } from 'react-router-dom';
import { PageLayoutAlert, PageLayoutMain, ViewItemList } from '../../components';
import { CircularProgress, Stack, Grid } from '@mui/material';
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

const DashboardContent = (props: { dateStart: string, dateEnd: string, productCode: string }) => {
    const { inProgress } = useMsal();
    const [data, setData] = useState<{ columns: {}[], data: {}[] }>({ columns: [], data: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<String>("");
    const location = useLocation();
    const arrPath = location.pathname.split("/")

    const handleChangeData = useCallback((result: any) => {
        for (let i in result.data) {
            const id = result.data[i].id
            if (result.data[i].category_name==="仕入") {
                result.data[i].link_page = <a href={`/${arrPath[1]}/order/edit/${id.substring(id.indexOf("_") + 1)}`}>link</a>
            } else if (result.data[i].category_name==="使用") {
                result.data[i].link_page = <a href={`/${arrPath[1]}/day_report/product/edit/${id.substring(id.indexOf("_") + 1)}`}>link</a>
            }
        }
        setData({
            columns: [
                { title: 'id', field: 'id', cellStyle: { textAlign: 'left', fontSize: "medium" }, hidden: true },
                { title: '発生日', field: 'report_date', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '発生理由', field: 'category_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '管理コード', field: 'product_code', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '製品名', field: 'product_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '取引先名', field: 'supplier_name', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '在庫数量', field: 'calc_cnt', cellStyle: { textAlign: 'right', fontSize: "medium" }, render: (e: any) => Number(e.calc_cnt).toLocaleString() },
                { title: '単位', field: 'unit', cellStyle: { textAlign: 'center', fontSize: "medium" } },
                { title: '在庫額(円)', field: 'stock_price', cellStyle: { textAlign: 'right', fontSize: "medium" }, type: "currency", currencySetting: { currencyCode: 'JPY', minimumFractionDigits: 2, maximumFractionDigits: 2 } },
                { title: '単価(円)', field: 'order_check_price_unit', cellStyle: { textAlign: 'right', fontSize: "medium" }, type: "currency", currencySetting: { currencyCode: 'JPY', minimumFractionDigits: 2, maximumFractionDigits: 2 } },
                { title: '科目カテゴリ', field: 'product_kamoku_category', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: 'カテゴリ1', field: 'product_category_1', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: 'カテゴリ2', field: 'product_category_2', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: 'カテゴリ3', field: 'product_category_3', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '登録日', field: 'created_at', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '更新日', field: 'updated_at', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '登録者', field: 'created_by', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '更新者', field: 'updated_by', cellStyle: { textAlign: 'left', fontSize: "medium" } },
                { title: '[リンク]発生ページ', field: 'link_page', cellStyle: { textAlign: 'center', fontSize: "medium" }, hidden: false },
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
            ApiGet(apiPath.stock.vReportHistProduct, `?s=${props.dateStart}&e=${props.dateEnd}&disable=1&productCode=${String(props.productCode || "")}`, arrPath[1])
                .then(response => handleChangeData(response))
                .catch(e => handleChangeError(e));
        }
    }, [inProgress, props.dateStart, props.dateEnd, props.productCode, handleChangeData, handleChangeError]);

    if (error) {
        return (<PageLayoutAlert errMsg={error} />)
    }

    return <>
        {loading ?
            <div className="text-center + mt-3"><CircularProgress size={80} color="info" /></div>
            :
            <ViewItemList title={"[出納]製品"} ViewData={data} isLoading={loading} disableActionButton={true} />
        }
    </>;
};

export const HistReportProductMain = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    type Inputs = {
        dateStart: string
        dateEnd: string
        productCode: { id: string, name: string } | null
    }
    const [query, setQuery] = useState<Inputs>({
        dateStart: searchParams.get('s') || moment().add(-7, 'days').format("yyyy-MM-DD"),
        dateEnd: searchParams.get('e') || moment().add(0, 'months').format("yyyy-MM-DD"),
        productCode: searchParams.get('productCode') ? { id: searchParams.get('productCode') || "", name: searchParams.get('productCode') || "" } : null
    })
    const [products, setProducts] = useState<{ id: string | number; name: string }[]>([]);
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
            defaultValues: { dateStart: query.dateStart, dateEnd: query.dateEnd, productCode: query.productCode }
        })
        const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
            setQuery({ ...query, "dateStart": data.dateStart, "dateEnd": data.dateEnd, "productCode": data.productCode })
            setSearchParams({ s: data.dateStart, e: data.dateEnd, productCode: data.productCode?.id || "" }, { replace: true })
        }

        return (
            <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)} className="mt-2 + mb-2">
                <Grid container style={{ "alignItems": "center" }}>
                    <Grid item>
                        <TextInput
                            name="dateStart" type={"date"} control={control} validationRule={validationRules.text} disabled={false}
                            label={"発生日(始)"} widthType={"xsmall"} rows={1}
                        />
                    </Grid>
                    <Grid item className="text-center">
                        ～
                    </Grid>
                    <Grid item>
                        <TextInput
                            name="dateEnd" type={"date"} control={control} validationRule={validationRules.text} disabled={false}
                            label={"発生日(終)"} widthType={"xsmall"} rows={1}
                        />
                    </Grid>
                    <Grid item className="me-2">
                        <SelectBoxSearch
                            name={`productCode`} control={control} validationRule={{}} disabled={false} disableClearable={false}
                            label={"製品名"} widthType={"half"} options={products}
                        />
                    </Grid>
                </Grid>
                <Grid className="ms-2" container style={{ "alignItems": "center" }}>
                    <Grid item>
                        <SearchButton type="submit" disabled={false} />
                    </Grid>
                </Grid>
            </Stack>
        )
    }

    return (
        <PageLayoutMain cardTitle="[出納]製品" cardSubTitle="在庫サマリ" cardText="" viewOnlyFlg={true} optionLayout={<OptionLayout />}>
            <DashboardContent dateStart={query.dateStart} dateEnd={query.dateEnd} productCode={query.productCode?.id || ""} />
        </PageLayoutMain>
    )
};
