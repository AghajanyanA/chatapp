import { RootState } from '../../redux/store';
export const loginSelector = (state: RootState) => state.login
export const chatSelector = (state: RootState) => state.chat