import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageLayoutMain } from '../../../components';
import { Box, Tabs, Tab } from '@mui/material';
import { DashboardContentUserMain } from './UserMain'
import { Error404 } from "../../Error";


export const AdminPageMainRoute = () => {
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
                        <Tab label="ユーザ管理" value={"user"}/>
                    </Tabs>
                </Box>
            </>
        )
    }

    return (
        <>
            {(() => {
                if (value === "user") {
                    return (
                        <PageLayoutMain cardTitle="ユーザ管理" cardSubTitle="管理ページ" cardText="" optionLayout={<OptionLayout />} >
                            <DashboardContentUserMain />
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
