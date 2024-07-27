import axios from "axios";

export const getInitialJobs = async (params = []) => {
    return await axios.get(route('spark-jobs.all'), {params})
}

export const loadStage = (stage, limit, skip) => {
    return axios.patch(route('spark-jobs.stage-jobs',
        {limit: limit, 'stage': stage, skip: skip}));
}

export const addJob = async (data) => {
    return axios.post(route('spark-jobs.store'), data);
}

export const getJob = async (id) => {
    return axios.get(route('spark-jobs.edit', id));
}

export const updateJob = async (id, data) => {
    return axios.put(route('spark-jobs.update', id), data);
};

export const updateJobUserInfo = async (id, data) => {
    return axios.put(route('spark-jobs.update-job-user-info', id), data);
};

