import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Tabs, Tab } from '@mui/material';
import { StockReportProductMain } from './StockReportProductMain'
import { HistReportProductMain } from './HistReportProductMain'
import { Error404 } from "../Error";


export const SummaryMainRoute = () => {
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const [searchParams] = useSearchParams();
    const urlParams = useParams<{ index: string }>()
    const urlParamsIndex: string = String(urlParams.index)
    const navigate = useNavigate()
    const [value, setValue] = useState(urlParamsIndex);

    const onChangePage: any = (newValue: number) => {
        //setValue(newValue);
        if (newValue in ["product_stock"]) {
            navigate(`/${arrPath[1]}/summary/${newValue}?${searchParams.get('date') ? `date=${searchParams.get('date')}` : ""}`)
        } else {
            navigate(`/${arrPath[1]}/summary/${newValue}?${searchParams.get('s') ? `s=${searchParams.get('s')}` : ""}${searchParams.get('e') ? `&e=${searchParams.get('e')}` : ""}`)
        }
    };

    useEffect(() => {
        setValue(urlParamsIndex)
    }, [urlParamsIndex])

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs aria-label="label" value={value} onChange={(_, value) => onChangePage(value)}>
                    <Tab label="[在庫]製品" value={"product_stock"} />
                    <Tab label="[出納]製品" value={"product_hist"} />
                </Tabs>
                {(() => {
                    if (value === "product_stock") {
                        return (
                            <StockReportProductMain />
                        )
                    } else if (value === "product_hist") {
                        return (
                            <HistReportProductMain />
                        )
                    } else {
                        return (
                            <Error404 />
                        )
                    }
                })()}
            </Box>
        </>
    )
};
