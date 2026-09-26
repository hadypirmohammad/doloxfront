import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

const STEP_PARAM = 'step';
const SHALLOW = { shallow: true, scroll: false };

export function useStepHistory(step, setStep, { initialStep = 0, lastStep = Infinity } = {}) {
    const router = useRouter();
    const ready = useRef(false);
    const cleaning = useRef(false);
    const stack = useRef([]);
    const param = router.query[STEP_PARAM];

    const readUrlStep = () => {
        const value = Number(param);
        return param !== undefined && Number.isInteger(value) ? value : initialStep;
    };

    const buildTarget = (value) => {
        const query = { ...router.query };
        if (value === initialStep) delete query[STEP_PARAM];
        else query[STEP_PARAM] = value;
        return { pathname: router.pathname, query };
    };

    useEffect(() => {
        if (!router.isReady || ready.current) return;
        ready.current = true;
        if (param !== undefined) {
            cleaning.current = true;
            router.replace(buildTarget(initialStep), undefined, SHALLOW);
        }
    }, [router.isReady]);

    useEffect(() => {
        if (!ready.current || cleaning.current || step > lastStep) return;

        const current = readUrlStep();
        if (current === step) return;

        if (step > current) {
            stack.current.push(current);
            router.push(buildTarget(step), undefined, SHALLOW);
            return;
        }

        if (stack.current[stack.current.length - 1] === step) {
            stack.current.pop();
            router.back();
            return;
        }

        router.replace(buildTarget(step), undefined, SHALLOW);
    }, [step]);

    useEffect(() => {
        if (!ready.current || step > lastStep) return;

        const current = readUrlStep();

        if (cleaning.current) {
            if (current === initialStep) cleaning.current = false;
            return;
        }

        if (current < step) {
            stack.current.pop();
            setStep(current);
        } else if (current > step) {
            router.replace(buildTarget(step), undefined, SHALLOW);
        }
    }, [param]);
}
