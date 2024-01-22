import { useParams } from 'react-router-dom';
import { Error404 } from '../../Error'
import { ProductNew } from './ProductNew'
import { SupplierNew } from './SupplierNew'
import { CategoryNew } from './CategoryNew'

export const ProductNewRoute = () => {
    const urlParams = useParams<{ index: string }>()
    const urlParamsIndex: string = String(urlParams.index)

    if (urlParamsIndex === "product") {
        return (<ProductNew index={urlParamsIndex} />)
    } else if (urlParamsIndex === "supplier") {
        return (<SupplierNew index={urlParamsIndex}/>)
    } else if (urlParamsIndex === "kamoku_cat") {
        return (<CategoryNew index={urlParamsIndex}/>)
    } else if (urlParamsIndex === "cat1") {
        return (<CategoryNew index={urlParamsIndex}/>)
    } else if (urlParamsIndex === "cat2") {
        return (<CategoryNew index={urlParamsIndex}/>)
    } else if (urlParamsIndex === "cat3") {
        return (<CategoryNew index={urlParamsIndex}/>)
    } else {
        return (<Error404 />)
    }
};