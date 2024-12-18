interface ThemeTypes{
    background: string
    shape: string
    text: string
}

const darkColors: ThemeTypes = {
    background: '#18181B',
    shape: '#A1A1AA',
    text: '#FFFFFF',
}

const lightColors: ThemeTypes = {
    background: '#FFFFFF',
    shape: '#A1A1AA',
    text: '#18181B',
}

export { darkColors, lightColors }