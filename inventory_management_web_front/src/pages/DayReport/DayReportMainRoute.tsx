import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageLayoutMain } from '../../components';
import { TextInput, SearchButton, SelectBoxSearch } from '../../UIkit';
import { validationRules } from "../../config/validationConfig";
import { Box, Tabs, Tab, Stack, Grid } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form'
import { DashboardContentMain as DashboardContentProductMain } from './DayReportProductMain'

import moment from 'moment'
import { Error404 } from "../Error";
// API imports
import { ApiGet } from "../../utils/ApiCall";
import { apiPath } from "../../config/authConfig";

// Msal imports
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";


export const DayReportMainRoute = () => {
    const navigate = useNavigate()
    const urlParams = useParams<{ index: string }>()
    const urlParamsIndex: string = String(urlParams.index)
    const [value, setValue] = useState(urlParamsIndex);
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const routePath = `${arrPath[1]}/${arrPath[2]}/${arrPath[3]}`
    const [searchParams, setSearchParams] = useSearchParams();
    const { instance, inProgress } = useMsal();
    type Inputs = {
        dateStart: string
        dateEnd: string
        productCode: { id: string, name: string } | null
    }
    const [query, setQuery] = useState<Inputs>({ dateStart: searchParams.get('s') || moment().add(-7, 'days').format("yyyy-MM-DD"), dateEnd: searchParams.get('e') || moment().add(14, 'days').format("yyyy-MM-DD"), productCode: searchParams.get('productCode') ? { id: searchParams.get('productCode') || "", name: searchParams.get('productCode') || "" } : null });
    const [products, setProducts] = useState<{ id: string | number; name: string }[]>([]);

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

    useEffect(() => {
        setValue(urlParamsIndex)
    }, [urlParamsIndex])

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
        // 検索ボタン押下
        const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
            setQuery({
                ...query, "dateStart": data.dateStart, "dateEnd": data.dateEnd, "productCode": data.productCode
            })
            setSearchParams(
                {
                    s: data.dateStart,
                    e: data.dateEnd,
                    productCode: data.productCode?.id || ""
                }, { replace: true }
            )
        }
        const onChangePage: any = (value: string) => {
            navigate(`/${routePath}/${value}`)
        }

        return (
            <>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs aria-label="label" value={value} onChange={(_, value) => onChangePage(value)}>
                        <Tab label="[製品]使用日報" value={"product"} />
                    </Tabs>
                </Box>
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
            </>
        )
    }

    return (
        <>
            {(() => {
                if (value === "product") {
                    return (
                        <PageLayoutMain cardTitle="使用日報 (在庫減少)" cardSubTitle="在庫管理" cardText="" optionLayout={<OptionLayout />} newPagePath={`new?s=${query.dateStart}&e=${query.dateEnd}&productCode=${query.productCode?.id || ""}`}>
                            <DashboardContentProductMain dateStart={query.dateStart} dateEnd={query.dateEnd} productCode={query.productCode?.id || ""} />
                        </PageLayoutMain>
                    )
                } else {
                    return (
                        <Error404 />
                    )
                }
            })()}
        </>
    )
};
