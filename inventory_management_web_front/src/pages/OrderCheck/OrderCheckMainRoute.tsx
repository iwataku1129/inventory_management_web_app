import { useState, useEffect, useCallback } from "react";
import { useLocation, useSearchParams } from 'react-router-dom';
import { PageLayoutMain } from '../../components';
import { TextInput, SearchButton, SwitchButton, SelectBoxSearch } from '../../UIkit';
import { validationRules } from "../../config/validationConfig";
import { Box, Tabs, Tab, Stack, Grid } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form'
import { DashboardContentMain } from './OrderCheckMain'
import { DashboardContentMonthMain } from './OrderCheckMonthMain'
import { DashboardContentSupplierMonthMain } from './OrderCheckSupplierMonthMain'

import moment from 'moment'
import { Error404 } from "../Error";
// API imports
import { ApiGet } from "../../utils/ApiCall";
import { apiPath } from "../../config/authConfig";

// Msal imports
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";


export const OrderCheckMain = () => {
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const [searchParams, setSearchParams] = useSearchParams();
    const { instance, inProgress } = useMsal();
    type Inputs = {
        category: string
        dateStart: string
        dateEnd: string
        month: string
        notCompflg: boolean
        supplierCode: { id: string, name: string } | null
    }
    const [value, setValue] = useState(String(searchParams.get('category') || "product"));
    const [query, setQuery] = useState<Inputs>({ category: String(searchParams.get('category') || "product"), notCompflg: searchParams.get('notCompflg') === "0" ? false : true, dateStart: searchParams.get('s') || moment().add(-7, 'days').format("yyyy-MM-DD"), dateEnd: searchParams.get('e') || moment().add(14, 'days').format("yyyy-MM-DD"), month: searchParams.get('month') || moment().format("yyyy-MM"), supplierCode: searchParams.get('supplierCode') ? { id: searchParams.get('supplierCode') || "", name: searchParams.get('supplierCode') || "" } : null });
    const [supplier, setSupplier] = useState<{ id: string | number; name: string }[]>([]);

    // DidMount
    useEffect(() => {
        const getSuppliers = () => {
            if (supplier.length === 0 && inProgress === InteractionStatus.None) {
                ApiGet(apiPath.master.vSupplier, ``, arrPath[1])
                    .then(response => handleChangeSupplierData(response))
                //.catch(e => handleChangeError(e));
            }
        }
        getSuppliers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inProgress, instance])

    // Change CallBackFunctions
    const handleChangeSupplierData = useCallback((result: any) => {
        const tmp = result.data.map((value: { supplier_code: string, supplier_name: string }) => {
            return { id: value.supplier_code, name: `${value.supplier_name} (${value.supplier_code})` }
        })
        setSupplier(tmp)
    }, [setSupplier])

    const OptionLayout = () => {
        const { control, handleSubmit } = useForm<Inputs>({
            defaultValues: { category: query.category, dateStart: query.dateStart, dateEnd: query.dateEnd, month: query.month, notCompflg: query.notCompflg, supplierCode: query.supplierCode }
        })
        // 検索ボタン押下
        const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
            setQuery({
                ...query, "dateStart": data.dateStart, "dateEnd": data.dateEnd, "month": data.month, "notCompflg": data.notCompflg, "supplierCode": data.supplierCode
            })
            setSearchParams(
                {
                    category: String(data.category),
                    s: data.dateStart,
                    e: data.dateEnd,
                    month: data.month,
                    notCompflg: data.notCompflg ? "1" : "0",
                    supplierCode: data.supplierCode?.id || ""
                }, { replace: true }
            )
        }
        const onChangePage: any = (value: string) => {
            setValue(value)
            setQuery({ ...query, "category": value })
        }

        return (
            <>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs aria-label="label" value={value} onChange={(_, value) => onChangePage(value)}>
                        <Tab label="仕入製品別" value={"product"}/>
                        <Tab label="[月次]仕入製品別" value={"product_month"}/>
                        <Tab label="[月次]取引先別" value={"supplier_month"}/>
                    </Tabs>
                </Box>
                <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)} className="mt-2 + mb-3">
                    <Grid container style={{ "alignItems": "center" }}>
                        {value === "product" && (
                            <>
                                <Grid item>
                                    <TextInput
                                        name="dateStart" type={"date"} control={control} validationRule={validationRules.text} disabled={false}
                                        label={"納品日(始)"} widthType={"xsmall"} rows={1}
                                    />
                                </Grid>
                                <Grid item className="text-center">
                                    ～
                                </Grid>
                                <Grid item>
                                    <TextInput
                                        name="dateEnd" type={"date"} control={control} validationRule={validationRules.text} disabled={false}
                                        label={"納品日(終)"} widthType={"xsmall"} rows={1}
                                    />
                                </Grid>
                            </>
                        )}
                        {value !== "product" && (
                            <>
                                <Grid item>
                                    <TextInput
                                        name="month" type={"month"} control={control} validationRule={validationRules.text} disabled={false}
                                        label={"納品月"} widthType={"xsmall"} rows={1}
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item className="me-2">
                            <SelectBoxSearch
                                name={`supplierCode`} control={control} validationRule={{}} disabled={false} disableClearable={false}
                                label={"取引先名"} widthType={"half"} options={supplier}
                            />
                        </Grid>
                        <Grid item className="mb-2 + ms-2" >
                            <SwitchButton name="notCompflg" control={control} disabled={false}
                                label="未完"
                            />
                        </Grid>
                        <Grid className="ms-2" container style={{ "alignItems": "center" }}>
                            <Grid item>
                                <SearchButton type="submit" disabled={false} />
                            </Grid>
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
                        <PageLayoutMain cardTitle="仕入・納品 (在庫増加)" cardSubTitle="在庫管理" cardText="" optionLayout={<OptionLayout />} newPagePath={`new?s=${query.dateStart}&e=${query.dateEnd}&month=${query.month}&notCompflg=${query.notCompflg ? "1" : "0"}&supplierCode=${query.supplierCode?.id || ""}`}>
                            <DashboardContentMain dateStart={"2022-01-50"} dateEnd={query.dateEnd} notCompflg={query.notCompflg} supplierCode={query.supplierCode?.id || ""} />
                        </PageLayoutMain>
                    )
                } else if (value === "product_month") {
                    return (
                        <PageLayoutMain cardTitle="仕入・納品 (在庫増加)" cardSubTitle="在庫管理" cardText="" optionLayout={<OptionLayout />} newPagePath={`new?s=${query.dateStart}&e=${query.dateEnd}&month=${query.month}&notCompflg=${query.notCompflg ? "1" : "0"}&supplierCode=${query.supplierCode?.id || ""}`}>
                            <DashboardContentMonthMain month={query.month} notCompflg={query.notCompflg} supplierCode={query.supplierCode?.id || ""} />
                        </PageLayoutMain>
                    )
                } else if (value === "supplier_month") {
                    return (
                        <PageLayoutMain cardTitle="仕入・納品 (在庫増加)" cardSubTitle="在庫管理" cardText="" optionLayout={<OptionLayout />} newPagePath={`new?s=${query.dateStart}&e=${query.dateEnd}&month=${query.month}&notCompflg=${query.notCompflg ? "1" : "0"}&supplierCode=${query.supplierCode?.id || ""}`}>
                            <DashboardContentSupplierMonthMain month={query.month} notCompflg={query.notCompflg} supplierCode={query.supplierCode?.id || ""} />
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
