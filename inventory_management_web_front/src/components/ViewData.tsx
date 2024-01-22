import { useNavigate } from 'react-router-dom';
import MaterialTable from '@material-table/core';
import { ExportCsv } from '@material-table/exporters';
import moment from 'moment'


export const ViewItemList = (props: { title?: string, query?: string, ViewData: { columns: {}[], data: {}[] }, isLoading?: boolean, routeCat?: string, disableActionButton?: boolean }) => {
    const navigate = useNavigate();
    return (
        <>
            <div className="ms-3 + me-3">
                <MaterialTable
                    title={props.title ? props.title : "一覧"}
                    actions={props.disableActionButton ? [] : [
                        {
                            icon: 'edit',
                            tooltip: 'Edit Item',
                            onClick: (_: React.MouseEvent<HTMLElement>, data: any) => navigate(props.routeCat ? `/${props.routeCat}/edit/${data.id}${props.query ? props.query : ""}` : `edit/${data.id}${props.query ? props.query : ""}`)
                        },
                        //{
                        //    tooltip: 'Remove All Selected Users',
                        //    icon: 'delete',
                        //    onClick: (evt, data: any) => alert('You want to delete ' + data.id + ' rows')
                        //},
                    ]}
                    isLoading={props.isLoading}
                    options={{
                        columnsButton: true,
                        exportMenu: [{
                            label: 'Export CSV',
                            exportFunc: (cols, datas) => ExportCsv(cols, datas, `在庫管理Web_${props.title ? props.title : "一覧"}_${moment().format("YYYYMMDD")}`)
                        }],
                        filtering: false,
                        fixedColumns: {
                            left: 0,
                            right: 0
                        },
                        grouping: false,
                        headerStyle: {
                            backgroundColor: '#01579b',
                            color: '#FFF',
                            position: 'sticky',
                            textAlign: 'center',
                            top: 0,
                            whiteSpace: 'nowrap',
                        },
                        maxBodyHeight: 500,
                        maxColumnSort: 2,
                        paging: true,
                        pageSizeOptions: [100, 500, 1000, 5000, 10000],
                        pageSize: 1000,
                        rowStyle: {
                            whiteSpace: 'pre',
                        },
                        search: true,
                        selection: false,
                    }}
                    columns={props.ViewData.columns}
                    data={props.ViewData.data}
                />
            </div>
        </>
    );
}
