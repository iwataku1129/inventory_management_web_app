import { useParams } from 'react-router-dom';
import { Error404 } from '../../Error'
import { CategoryNew } from './CategoryNew'

export const DayReportCatNewRoute = () => {
    const urlParams = useParams<{ index: string }>()
    const urlParamsIndex: string = String(urlParams.index || 0)

    if (urlParamsIndex === "report_category") {
        return (<CategoryNew index={urlParamsIndex}/>)
    } else {
        return (<Error404 />)
    }
};