import type { ApplicantProfile } from '../types';

function makeDeptString(department: string) {
  const deptArr = department.split(',');
  let output: string = "";

  for (let i = 0; i < deptArr.length; i++) {
    output += deptArr[i].trim();
    if (i > 0)
      output += '(다전공)';
    if (i < deptArr.length - 1)
      output += ' · ';
  }

  return output;
}

function makeYearString(enrollYear: number) {
  const yearString = enrollYear.toString();
  return yearString.slice(-2);
}

const ProfileTab = (props: ApplicantProfile) => {
  const optionalFieldExist =
    props.positions || props.explanation || props.stacks || props.links;

  const deptString = props.department ? makeDeptString(props.department) : '무전공';
  const yearString = props.enrollYear ? makeYearString(props.enrollYear) : '무';

  return (
    <div className="py-2 flex flex-col gap-10">
      <h2 className="text-2xl font-bold">{props.name}</h2>

      <div className="flex flex-col text-md font-medium text-[#5f656f] gap-2">
        <p>{props.email}</p>
        <p>
          {deptString} {yearString}학번
        </p>
      </div>

      {optionalFieldExist && <h2 className="text-2xl font-bold">기본 정보</h2>}

      <div className="flex flex-col gap-6 text-[#484c53]">
        {props.positions && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold">희망 직무</h3>
            <p>{props.slogan}</p>
          </div>
        )}

        {props.stacks && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold">기술 스택</h3>
            <div className="flex place-content-start gap-2">
              {props.stacks.map((stack: string) => (
                <div className="rounded-sm border border-[#e8ebef]">
                  <p className="mx-2 my-1">{stack}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {props.explanation && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold">자기소개</h3>
            {/* TODO: Implement the line clamp */}
            <p>{props.explanation}</p>
          </div>
        )}

        {props.links && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold">소개 링크</h3>
            {/* TODO: Implement links */}
            <p>{props.slogan}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
