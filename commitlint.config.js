export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', 50],
        'type-enum': [2, 'always', ['feat', 'fix', 'chore', 'docs', 'refactor', 'test', 'ci', 'build']],
        'subject-case': [2, 'always', 'lower-case'],
        'subject-full-stop': [2, 'never', '.'],
        'body-empty': [2, 'never'],
        'body-leading-blank': [2, 'always'],
        'body-max-line-length': [2, 'always', 72],
        'footer-max-line-length': [2, 'always', 72]
    }
};
