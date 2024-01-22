import { useParams } from 'react-router-dom';
import { Error404 } from '../Error'
import { DayReportProductNew } from './DayReportProductNew'

export const DayReportNew = () => {
    const urlParams = useParams<{ index: string }>()
    const urlParamsIndex: string = String(urlParams.index)

    if (urlParamsIndex === "product") {
        return (<DayReportProductNew index={urlParamsIndex}/>)
    } else {
        return (<Error404 />)
    }
};
