
import { createTheme, alpha, getContrastRatio } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        tiffany: {
            main: '#93E1D8',
            light: '#CFF2EE',
            dark: '#6FD8CB',
            contrastText: '#111',
        },
        melon: {
            main: '#FFA69E',
            light: '#FFDAD6',
            dark: '#FF7C70',
            contrastText: '#111',
        },
        raspberry: {
            main: '#AA4465',
            light: '#EED3DC',
            dark: '#83344D',
            contrastText: '#FFF',
        },
        purple: {
            main: '#E6D3EE',
            light: '#EEE2F4',
            dark: '#CDA7DD',
            contrastText: '#111',
        },
        violet: {
            main: '#462255',
            light: '#542966',
            dark: '#24112C',
            contrastText: '#FFF',
        },

    },
});

export default theme