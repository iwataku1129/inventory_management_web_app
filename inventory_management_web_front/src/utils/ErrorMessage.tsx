
export const getErrorMessage = async (e: any) => {
    const status = e.response?.status
    const message = e.response?.data?.message || ""
    const errorMessage = e.response?.data?.error || ""

    if (status === 400 && message === "Content can not be empty!") {
        return `未入力項目があります<br/>${e}`
    } else if (status === 400 && message === "does not include where") {
        return `更新パラメータが存在しません<br/>${e}`
    } else if (status === 400 && message === "No registration") {
        return `登録実績がありません<br/>${e}`
    } else if (status === 400 && (message === "make_cnt is out of range" || message === "use_cnt is out of range" || message === "order_cnt is out of range" || message === "order_check_cnt_unit is out of range")) {
        return `数量同期エラー<br/>${e}`
    } else if (status === 401) {
        return `認証がされていません。ログインをしてください<br/>${e}`
    } else if (status === 403 && message === "User does not have the required permissions") {
        return `権限が付与されていません。管理者に権限追加依頼をしてください。<br/>${e}`
    } else if (status === 403 && message === "Some error occurred while getting accessUserId.") {
        return `アカウントが存在しません。管理者に権限追加依頼をしてください。<br/>${e}`
    } else if (status === 409 && message === "Update Conflict") {
        return `他のユーザが更新したため上書きできません。ページ更新をしてください。<br/>${e}`
    } else if (status === 409 && message === "Parameter Conflict") {
        return `[コード]が重複しています<br/>${e}`
    } else if (status === 500) {
        return `サーバー側で何らかの問題が発生しました。<br/>${message}<br/>${e}`
    }
    return `${message?`${message}<br/>`:""}${errorMessage?`${errorMessage}<br/>`:""}${e}`
}