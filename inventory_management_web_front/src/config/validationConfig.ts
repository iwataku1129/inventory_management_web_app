export const validationRules = {
    // text系
    text: { required: '文字を入力してください。' },
    textLen4: { required: '文字を入力してください。', minLength: { value: 4, message: '4文字以上で入力してください。' } },
    email: { required: 'メールアドレスを入力してください。', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "適切なメールアドレスを入力してください。" } },
    engIower: { required: '英字(小文字)を入力してください。', pattern: { value: /^[a-z]+$/, message: "英字(小文字)で入力してください" }, minLength: { value: 4, message: '4文字以上で入力してください。' } },
    // 数値系
    numberPer: {
        required: '数値を入力してください。', min: { value: 1, message: '最小は1です' }, max: { value: 100, message: '最大は100です' },
        validate: (value: number | '') => String(value).indexOf(".") > -1 ? '整数値を入力してください。' : null
    },
    numberSmallintUnsigned: {
        required: '数値を入力してください。', min: { value: 0, message: '最小は0です' }, max: { value: 65535, message: '最大は65535です' },
        validate: (value: number | '') => String(value).indexOf(".") > -1 ? '整数値を入力してください。' : null
    },
    numberIntSigned: {
        required: '数値を入力してください。', min: { value: -2147483648, message: '最小は-2147483648です' }, max: { value: 2147483647, message: '最大は2147483647です' },
        validate: (value: number | '') => String(value).indexOf(".") > -1 ? '整数値を入力してください。' : null
    },
    numberIntUnsigned: {
        required: '数値を入力してください。', min: { value: 0, message: '最小は0です' }, max: { value: 4294967295, message: '最大は4294967295です' },
        validate: (value: number | '') => String(value).indexOf(".") > -1 ? '整数値を入力してください。' : null
    },
    numberDecimal10_2Signed: {
        required: '数値を入力してください。', min: { value: -99999999.99, message: '最小は-99999999.99です' }, max: { value: 99999999.99, message: '最大は99999999.99です' },
        validate: (value: number | '') => {
            const decimalPart = String(value).split(".")
            if (decimalPart[1] && String(decimalPart[1]).length > 2) {
                return '少数は2桁以内で入力してください。'
            }
        }
    },
    numberDecimal10_2Unsigned: {
        required: '数値を入力してください。', min: { value: 0, message: '最小は0です' }, max: { value: 99999999.99, message: '最大は99999999.99です' },
        validate: (value: number | '') => {
            const decimalPart = String(value).split(".")
            if (decimalPart[1] && String(decimalPart[1]).length > 2) {
                return '少数は2桁以内で入力してください。'
            }
        }
    },
    // state系
    state: { validate: (value: number | '') => value !== '' || 'いずれかを選択してください。' },
    stateSearch: { required: '項目を選択してください。' },
}