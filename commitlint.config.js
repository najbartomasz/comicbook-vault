// Lines that consist solely of a "nothing to report" placeholder. Anchored to a
// whole line so ordinary prose mentioning breaking changes is left alone.
const placeholderFooters = [
    /^[ \t]*no\s+(issue\s+references?|issues?|breaking\s+changes?|refs?|footers?)[ \t]*\.?[ \t]*$/im,
    /^[ \t]*(refs?|closes?|fixes|breaking[ \t]change)[ \t]*:[ \t]*(none|n\/?a|null|nil|-+)[ \t]*\.?[ \t]*$/im
];

export default {
    extends: ['@commitlint/config-conventional'],
    plugins: [
        {
            rules: {
                'no-placeholder-footer': (parsed) => {
                    const text = [parsed.body, parsed.footer].filter((part) => typeof part === 'string').join('\n');
                    const match = placeholderFooters.reduce((found, pattern) => found ?? pattern.exec(text)?.[0], undefined);
                    return [
                        match === undefined,
                        `remove the placeholder line "${match?.trim() ?? ''}" — omit the footer when there is nothing to reference`
                    ];
                }
            }
        }
    ],
    rules: {
        'header-max-length': [2, 'always', 50],
        'type-enum': [2, 'always', ['feat', 'fix', 'chore', 'docs', 'refactor', 'test', 'ci', 'build']],
        'subject-case': [2, 'always', 'lower-case'],
        'subject-full-stop': [2, 'never', '.'],
        'body-empty': [2, 'never'],
        'body-leading-blank': [2, 'always'],
        'body-max-line-length': [2, 'always', 72],
        'footer-max-line-length': [2, 'always', 72],
        'no-placeholder-footer': [2, 'always']
    }
};
