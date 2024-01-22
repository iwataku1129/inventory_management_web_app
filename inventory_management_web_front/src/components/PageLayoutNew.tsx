import { ReactNode } from "react";
import { Card } from "react-bootstrap";

export const PageLayout = (props: { children: ReactNode, optPage?: ReactNode, cardTitle?: string, cardSubTitle?: string, cardText?: string, routePath: string, routeMethod: string }) => {
    document.title = `在庫管理Web - ${props.cardTitle}`
    return (
        <>
            <Card body className="ms-3 + me-3">
                {props.cardTitle ? <Card.Title>{props.routeMethod === "new" ? "【新規登録】" : "【詳細情報】"}{props.cardTitle}</Card.Title> : <></>}
                {props.cardSubTitle ? <Card.Subtitle className="mb-2 text-muted">{props.cardSubTitle}</Card.Subtitle> : <></>}
                {props.cardText ? <Card.Text>{props.cardText}</Card.Text> : <></>}
                <div className="text-end">
                    <a href={`/${props.routePath}`} className="text-muted" >{props.cardTitle ? props.cardTitle : ""} Topページへ</a>
                </div>
            </Card>
            <br />
            <Card body className="ms-3 + me-3">
                {props.children}
            </Card>
            <br />
            {props.optPage}
        </>
    );
};