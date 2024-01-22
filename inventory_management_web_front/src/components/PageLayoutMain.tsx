import { ReactNode } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Card } from "react-bootstrap";
import { RouteGuardButton } from '../components';

export const PageLayout = (props: { children: ReactNode, cardTitle?: string, cardSubTitle?: string, cardText?: string, optionLayout?: ReactNode, newPagePath?: string, viewOnlyFlg?: boolean }) => {
    document.title = `在庫管理Web - ${props.cardTitle}`
    const navigate = useNavigate();
    return (
        <>
            <Card body className="ms-3 + me-3">
                {props.cardTitle ? <Card.Title>{props.cardTitle}</Card.Title> : <></>}
                {props.cardSubTitle ? <Card.Subtitle className="mb-2 text-muted">{props.cardSubTitle}</Card.Subtitle> : <></>}
                {props.cardText ? <Card.Text>{props.cardText}</Card.Text> : <></>}
                {props.optionLayout}
                {props.viewOnlyFlg ?
                    <></>
                    :
                    <div className="text-center + mt-1">
                        <RouteGuardButton roleCat="create" alert={true}>
                            <Button onClick={() => { navigate(props.newPagePath ? props.newPagePath : "new") }} variant="outline-primary">新規登録</Button>
                        </RouteGuardButton>
                    </div>
                }
            </Card>

            <br />
            {props.children}
            <br />
        </>
    );
};