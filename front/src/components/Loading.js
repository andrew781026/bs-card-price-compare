import {ElLoading} from 'element-plus'

let loadingInstance;

/**
 * {@link https://element-plus.org/en-US/component/loading.html#full-screen-loading 全頁 Loader}
 * @type {{close(): void, open(*): void}}
 */
const LoadingService = {

    open(text) {

        loadingInstance = ElLoading.service({
            lock: true,
            text,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7); font-size: 50px;',
        })
    },
    close() {

        loadingInstance.close();
    },
};

export default LoadingService;