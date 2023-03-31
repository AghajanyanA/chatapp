import { RootState } from '../../redux/store';
export default function loginSelector (state: RootState) {
    return state.login
}