# Claude Code Instructions for my-video

## 필수 지침

- **영상 제작 시 `/make-video` 커맨드 사용 권장** - 이미지, TTS, 컴포지션을 한 번에 처리
- **TTS(음성 생성)가 필요할 때는 반드시 Google Cloud TTS를 사용할 것**
- OpenAI TTS, Edge TTS 등 다른 TTS는 사용하지 않음
- **영상 제작 시 이미지가 필요하면 AI 생성 이미지 폴더에서 먼저 찾아볼 것**
  - JSON 파일에서 영상 주제와 맞는 콘텐츠 검색
  - output 폴더에서 해당 이미지 가져와서 사용

## 영상 제작 통합 커맨드

### `/make-video [주제]`
이미지 검색/생성 → TTS 음성 생성 → Remotion 컴포지션 작성까지 한 번에 처리

```
/make-video 30대 남성 눈썹 노화 주제로 15초 릴스 제작
```

### 개별 이미지 생성 커맨드
- `/imagen [영어 프롬프트]` - 한국인 실사 사진, 공간 촬영용
- `/dalle [영어 프롬프트]` - 아이콘, 일러스트, 인포그래픽용

## Google Cloud TTS 사용법

한국어 TTS가 필요할 때 Google Cloud TTS를 사용합니다.

### 설정 정보
- **계정**: brandheavies25@gmail.com
- **프로젝트**: preview-e7875
- **음성**: ko-KR-Wavenet-C (남성)

### TTS 생성 명령어

```bash
ACCESS_TOKEN=$(gcloud auth print-access-token)

curl -s -X POST \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-goog-user-project: preview-e7875" \
  "https://texttospeech.googleapis.com/v1/text:synthesize" \
  -d '{
    "input": {"text": "여기에 텍스트 입력"},
    "voice": {"languageCode": "ko-KR", "name": "ko-KR-Wavenet-C"},
    "audioConfig": {"audioEncoding": "MP3"}
  }' | jq -r '.audioContent' | base64 -d > public/output.mp3
```

### 사용 가능한 한국어 음성
- `ko-KR-Wavenet-A` - 여성
- `ko-KR-Wavenet-B` - 여성
- `ko-KR-Wavenet-C` - 남성
- `ko-KR-Wavenet-D` - 남성

## Remotion 프로젝트 구조

- `src/` - 컴포지션 파일들
- `public/` - 정적 파일 (오디오, 이미지)
- TTS 파일 네이밍: `tts{번호}_google.mp3`

## AI 생성 이미지 활용

영상 제작 시 AI로 미리 생성해둔 이미지를 활용할 수 있습니다.

### JSON 파일 (프롬프트 정의)
| 파일 | 내용 |
|------|------|
| /Users/josanghun/Desktop/EyebrowMagic/marketing-team/contents/instagram/b2b/b2b_contents.json | B2B AI 프롬프트 |
| /Users/josanghun/Desktop/EyebrowMagic/marketing-team/contents/instagram/b2c/b2c_contents.json | B2C AI 프롬프트 |
| /Users/josanghun/Desktop/EyebrowMagic/marketing-team/contents/instagram/b2b/male_client_series_contents.json | 남성 고객 시리즈 |
| /Users/josanghun/Desktop/EyebrowMagic/marketing-team/contents/instagram/b2b/munsinsa_law_contents.json | 문신사법 시리즈 |

### 생성된 이미지 경로
`/Users/josanghun/Desktop/EyebrowMagic/marketing-team/contents/instagram/output/`

### JSON 구조
```json
{
  "ai_prompt": "Korean woman scanning QR code on a beauty salon banner...",
  "ai_tool": "imagen"  // imagen(한국인 사진) 또는 dalle(일러스트)
}
```

### 사용법
1. JSON 파일에서 영상 주제와 맞는 콘텐츠 검색 (예: male_client_series_contents.json)
2. `image_prompt` 필드에서 AI 이미지 프롬프트 확인
3. output 폴더에서 해당 이미지 찾기 (파일명 패턴: `{content_id}_{날짜}` 형식)
4. **이미지가 없으면 커맨드로 AI 이미지 생성:**
   - `/imagen [영어 프롬프트]` - 한국인 실사 사진, 공간 촬영용
   - `/dalle [영어 프롬프트]` - 아이콘, 일러스트, 인포그래픽용
5. 이미지를 `public/` 폴더에 복사하고 Remotion에서 `staticFile("이미지명.png")`로 사용

### 참고: 남성 눈썹 영상 관련 콘텐츠
- `male_client_series_contents.json`의 `male_2` 콘텐츠가 현재 MaleEyebrowAging 영상과 일치
- 주요 훅: "30대 넘으면 눈썹이 이렇게 됩니다", "눈썹 노화", "탈모 연장"
