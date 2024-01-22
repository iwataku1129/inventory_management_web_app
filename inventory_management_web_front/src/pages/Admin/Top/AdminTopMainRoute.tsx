import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageLayoutMain } from '../../../components';
import { Box, Tabs, Tab } from '@mui/material';
import { DashboardContentPageMain } from './PageMain'
import { Error404 } from "../../Error";


export const AdminTopMainRoute = () => {
    const urlParams = useParams<{ index: string }>()
    const navigate = useNavigate()
    const urlParamsIndex: string = String(urlParams.index)
    const [value, setValue] = useState(urlParamsIndex);
    const location = useLocation();
    const arrPath = location.pathname.split("/")
    const routePath = `${arrPath[1]}/${arrPath[2]}`

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
                        <Tab label="ページ管理" value={"page"}/>
                    </Tabs>
                </Box>
            </>
        )
    }

    return (
        <>
            {(() => {
                if (value === "page") {
                    return (
                        <PageLayoutMain cardTitle="ページ管理" cardSubTitle="管理ページ(Top)" cardText="" optionLayout={<OptionLayout />} >
                            <DashboardContentPageMain />
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
