import { useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from "@mui/material"
import { MdHome, MdAddCircleOutline } from "react-icons/md";

export const BottomNavigationBarNew = (props: { topPageQuery: string, newPageQuery: string, routeMethod?: string }) => {
    const navigate = useNavigate()
    return (
        <BottomNavigation showLabels
            onChange={(_, newValue) => {
                navigate(newValue)
                if (newValue.indexOf("/new") > -1) {
                    window.location.reload();
                }
            }}
        >
            <BottomNavigationAction label="Top Page" icon={<MdHome />} value={props.topPageQuery ? props.topPageQuery : ``} />
            {(props.routeMethod && props.routeMethod) !== "new" && (
                <BottomNavigationAction label="新規登録" icon={<MdAddCircleOutline />} value={props.newPageQuery ? props.newPageQuery : `new`} />
            )}
        </BottomNavigation>
    )
}