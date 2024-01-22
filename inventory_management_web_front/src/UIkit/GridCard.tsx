import { ReactNode } from "react";
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';


export const GridCard = (props: { children?: ReactNode, title: string, subtitle: string, href?: string, minWidth?: number, maxWidth?: number }) => {
    return (
        <Grid item>
            <Card sx={{ maxWidth: props.maxWidth ? props.maxWidth : 345, minWidth: props.minWidth ? props.minWidth : 200 }}>
                <CardActionArea href={props.href ? props.href : ""}>
                    {props.children}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {props.subtitle}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}