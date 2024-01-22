import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageLayoutMain } from '../../../components';
import { Box, Tabs, Tab } from '@mui/material';
import { DashboardContentProductMain } from './ProductMain'
import { DashboardContentSupplierMain } from './SupplierMain'
import { DashboardContentCategoryMain } from './CategoryMain'
import { Error404 } from "../../Error";


export const ProductMainRoute = () => {
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
                        <Tab label="製品" value={"product"} />
                        <Tab label="取引先" value={"supplier"} />
                        <Tab label="科目カテゴリ" value={"kamoku_cat"} />
                        <Tab label="製品カテゴリ1" value={"cat1"} />
                        <Tab label="製品カテゴリ2" value={"cat2"} />
                        <Tab label="製品カテゴリ3" value={"cat3"} />
                    </Tabs>
                </Box>
            </>
        )
    }

    return (
        <>
            {(() => {
                if (value === "product") {
                    return (
                        <PageLayoutMain cardTitle="製品管理" cardSubTitle="マスタ管理" cardText="" optionLayout={<OptionLayout />} >
                            <DashboardContentProductMain />
                        </PageLayoutMain>
                    )
                } else if (value === "supplier") {
                    return (
                        <PageLayoutMain cardTitle="取引先管理" cardSubTitle="マスタ管理" cardText="" optionLayout={<OptionLayout />} >
                            <DashboardContentSupplierMain />
                        </PageLayoutMain>
                    )
                } else if (value === "kamoku_cat") {
                    return (
                        <PageLayoutMain cardTitle="科目管理" cardSubTitle="マスタ管理" cardText="" optionLayout={<OptionLayout />} >
                            <DashboardContentCategoryMain index={value} />
                        </PageLayoutMain>
                    )
                } else if (value === "cat1") {
                    return (
                        <PageLayoutMain cardTitle="製品カテゴリ1" cardSubTitle="マスタ管理" cardText="" optionLayout={<OptionLayout />} >
                            <DashboardContentCategoryMain index={value} />
                        </PageLayoutMain>
                    )
                } else if (value === "cat2") {
                    return (
                        <PageLayoutMain cardTitle="製品カテゴリ2" cardSubTitle="マスタ管理" cardText="" optionLayout={<OptionLayout />} >
                            <DashboardContentCategoryMain index={value} />
                        </PageLayoutMain>
                    )
                } else if (value === "cat3") {
                    return (
                        <PageLayoutMain cardTitle="製品カテゴリ3" cardSubTitle="マスタ管理" cardText="" optionLayout={<OptionLayout />} >
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
