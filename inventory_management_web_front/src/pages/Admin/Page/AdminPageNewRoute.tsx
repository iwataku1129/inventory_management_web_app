import { useParams } from 'react-router-dom';
import { Error404 } from '../../Error'
import { UserNew } from './UserNew'

export const AdminPageNewRoute = () => {
    const urlParams = useParams<{ index: string }>()
    const urlParamsIndex: string = String(urlParams.index || 0)

    if (urlParamsIndex === "user") {
        return (<UserNew index={urlParamsIndex}/>)
    } else {
        return (<Error404 />)
    }
};