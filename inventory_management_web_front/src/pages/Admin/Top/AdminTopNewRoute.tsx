import { useParams } from 'react-router-dom';
import { Error404 } from '../../Error'
import { PageNew } from './PageNew'

export const AdminTopNewRoute = () => {
    const urlParams = useParams<{ index: string }>()
    const urlParamsIndex: string = String(urlParams.index || 0)

    if (urlParamsIndex === "page") {
        return (<PageNew index={urlParamsIndex}/>)
    } else {
        return (<Error404 />)
    }
};