import { useState } from "react";
import { dataToOptions } from "@/Helpers/transformers.js";
import { fetchOptions } from "@/Helpers/api/mix.js";
import { ProFormSelect } from "@ant-design/pro-components";

/**
 * ProSelect
 * @param type
 * @param params
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const ProSelect = ({ type, params = {}, onRefresh, ...props }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = async (keyWords = "") => {
        setLoading(true);
        try {
            const res = await fetchOptions(type, keyWords, params);
            const options = dataToOptions(res);
            setData(options);
            return options;
        } catch (error) {
            console.error("Failed to fetch options:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Expose the refresh function
    if (onRefresh) {
        onRefresh(() => loadData());
    }

    return (
      <div >
        <ProFormSelect
            showSearch
            debounceTime={300}
            loading={loading}
            request={async ({ keyWords }) => {
                if (!keyWords && data.length) {
                    return data;
                }
                return await loadData(keyWords);
            }}
            options={data}
            {...props}
        />
      </div>
    );
};
