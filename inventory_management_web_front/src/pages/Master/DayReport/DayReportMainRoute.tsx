import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageLayoutMain } from '../../../components';
import { Box, Tabs, Tab } from '@mui/material';
import { DashboardContentCategoryMain } from './CategoryMain'
import { Error404 } from "../../Error";


export const DayReportCatMainRoute = () => {
    const urlParams = useParams<{ index: string }>()
    const navigate = useNavigate()
    const urlParamsIndex: string = String(urlParams.index)
    const [value, setValue] = useState(urlParamsIndex);
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const routePath = `${arrPath[1]}/${arrPath[2]}/${arrPath[3]}`

    useEffect(() => {
        setValue(urlParamsIndex)
    }, [urlParamsIndex])

    const OptionLayout = () => {
        const onChangePage: any = (value: string) => {
            navigate(`/${routePath}/${value}`)
        };

        return (
            <>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs aria-label="label" value={value} onChange={(_, value) => onChangePage(value)}>
                        <Tab label="使用理由" value={"report_category"}/>
                    </Tabs>
                </Box>
            </>
        )
    }

    return (
        <>
            {(() => {
                if (value === "report_category") {
                    return (
                        <PageLayoutMain cardTitle="使用理由" cardSubTitle="マスタ管理" cardText="" optionLayout={<OptionLayout />} >
                            <DashboardContentCategoryMain index={value} />
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
