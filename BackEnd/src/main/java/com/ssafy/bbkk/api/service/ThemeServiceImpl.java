package com.ssafy.bbkk.api.service;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.bbkk.api.dto.*;
import com.ssafy.bbkk.db.entity.*;
import com.ssafy.bbkk.db.repository.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ThemeServiceImpl implements ThemeService {

    private final UserRepository userRepository;
    private final RegionRepository regionRepository;
    private final ReviewRepository reviewRepository;
    private final ThemeRepository themeRepository;
    private final InterestedThemeOfUserRepository interestedRepository;
    private final AwardThemeRepository awardThemeRepository;
    private final RecommendedThemeOfUserRepository recommendedThemeOfUserRepository;
    private final HotThemeRepository hotThemeRepository;

    private final int THEME_RETURN_COUNT = 8;
    private final int THEME_COUNT = 10;

    @PersistenceContext
    private EntityManager entityManager;

    // 지역 id에 해당되는 지역의 인기 테마를 반환
    public ThemeBundleResponse getRegionBundle(int regionId) throws Exception {
        ThemeBundleResponse result = null;
        Random rnd = new Random();
        String label;

        // 테마의 지역
        Region region = regionRepository.findById(regionId)
                .orElseThrow(() -> new Exception("해당 지역을 찾을 수 없습니다."));

        List<PreviewThemeResponse> themes = null;
        List<Theme> list = null;
        int themeCnt = themeRepository.countByRegionId(region.getId());
        // 테마 개수가 적을 경우
        if (themeCnt < THEME_COUNT) {
            List<Region> regions = regionRepository.findAllByRegionBig(region.getRegionBig());
            // 지역 대분류에서 테마 가져오기
            list = new ArrayList<>();
            for (Region r : regions) {
                List<Theme> temp = themeRepository.findAllByRegionId(r.getId());
                if(temp != null){
                    list.addAll(temp);
                }
            }
            Collections.sort(list, Comparator.comparingDouble(Theme::getUserRating).reversed());
            label = region.getRegionBig() + "에서 인기있는 테마";
        }
        // 테마 개수가 많을 경우
        else {
            // 지역 소분류에서 테마 가져오기
            list = themeRepository.findByRegionIdOrderByUserRatingDesc(region.getId());
            label = region.getRegionBig() + " " + region.getRegionSmall() + "에서 인기있는 테마";
        }

        if(list == null || list.size() < THEME_RETURN_COUNT) return null;

        int cnt = 0;
        while (true) {
            cnt = 0;
            themes = new ArrayList<>();

            // 테마를 위에서부터 for문으로
            for (Theme theme : list) {
                // 확률에 의해 담긴다
                if (rnd.nextInt(10) < 8) { // 80%
                    cnt++;
                    themes.add(new PreviewThemeResponse(theme));
                }
                // 모두 담겼으면 끝
                if (cnt == THEME_RETURN_COUNT){
                    result = new ThemeBundleResponse(label, themes);
                    return result;
                }
            }
        }
    }

    // 사람들이 ~~다고 느낀 테마를 반환
    public ThemeBundleResponse getFeelBundle() throws Exception {
        Random rnd = new Random();
        int type = rnd.nextInt(4);

        ThemeBundleResponse result = null;
        List<PreviewThemeResponse> themes = null;
        List<Theme> list = null;
        String label = "";
        switch (type) {
            case 0: // 난이도 최고
                list = themeRepository.findByUserCntGreaterThanOrderByUserDifficultyDesc(4);
                label = "유저들이 어렵다고 느낀 테마";
                break;
            case 1: // 난이도 최하
                list = themeRepository.findByUserCntGreaterThanOrderByUserDifficultyAsc(4);
                label = "유저들이 쉽다고 느낀 테마";
                break;
            case 2: // 공포도 최고
                list = themeRepository.findByUserCntGreaterThanOrderByUserFearDesc(4);
                label = "유저들이 무섭다고 느낀 테마";
                break;
            case 3: // 공포도 최하
                list = themeRepository.findByUserCntGreaterThanOrderByUserFearAsc(4);
                label = "유저들이 무섭지 않다고 느낀 테마";
                break;
            default:
                throw new Exception("해당 type의 형식이 맞지 않습니다.");
        }

        if(list == null || list.size() < THEME_RETURN_COUNT) return null;

        int cnt = 0;
        while (true) {
            cnt = 0;
            themes = new ArrayList<>();

            // 테마를 위에서부터 for문으로
            for (Theme theme : list) {
                // 확률에 의해 담긴다
                if (rnd.nextInt(10) < 8) { // 80%
                    cnt++;
                    themes.add(new PreviewThemeResponse(theme));
                }
                // 모두 담겼으면 끝
                if (cnt == THEME_RETURN_COUNT){
                    result = new ThemeBundleResponse(label, themes);
                    return result;
                }
            }
        }
    }

    @Override
    public List<ThemeBundleResponse> getRecommendedThemes(String email) throws Exception {
        List<ThemeBundleResponse> result = null;
        // 유저 email을 통해 유저 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("해당 사용자를 찾을 수 없습니다."));
        // 추천 테마 리스트
        List<PreviewThemeResponse> CBFList = new ArrayList<>();
        List<PreviewThemeResponse> CFList = new ArrayList<>();
        int cnt = recommendedThemeOfUserRepository.countByUserId(user.getId());

        if (cnt > 0) {
            result = new ArrayList<>();
            // 유저의 추천 테마 목록 조회
            recommendedThemeOfUserRepository.findByUserId(user.getId())
                .forEach(x -> {
                    if (x.getType() == 1) {
                        CBFList.add(new PreviewThemeResponse(x.getTheme()));
                    } else {
                        CFList.add(new PreviewThemeResponse(x.getTheme()));
                    }
                });
            // CBF : 맞춤 테마
            result.add(new ThemeBundleResponse("님의 맞춤 추천 테마입니다", CBFList));
            // CF : 비슷한 유저와 비교시 맞춤 테마
            if (CFList.size() > 0) {
                result.add(new ThemeBundleResponse("님과 비슷한 유저가 자주간 테마입니다", CFList));
            }
        }
        return result;
    }

    @Override
    public List<PreviewThemeResponse> getHotThemes() throws Exception {
        List<PreviewThemeResponse> result = new ArrayList<>();
        // 금주 핫테마를 불러온다
        hotThemeRepository.findAll()
            .forEach(hotTheme -> result.add(new PreviewThemeResponse(hotTheme.getTheme())));
        return result;
    }

    @Override
    public List<ThemeBundleResponse> getTopThemes() throws Exception {
        List<ThemeBundleResponse> result = new ArrayList<>();
        Random rnd = new Random();
        // 체감 테마
        ThemeBundleResponse feelBundle = getFeelBundle();
        while(feelBundle == null){
            feelBundle = getFeelBundle();
        }
        result.add(feelBundle);

        List<Region> regionList = regionRepository.findAll();
        int idx = regionList.get(rnd.nextInt(regionList.size())).getId(); // 랜덤 지역 id
        // 지역 인기 테마
        ThemeBundleResponse regionBundle = getRegionBundle(idx);
        while(regionBundle == null){
            idx = regionList.get(rnd.nextInt(regionList.size())).getId(); // 랜덤 지역 id
            regionBundle = getRegionBundle(idx);
        }
        result.add(regionBundle);

        return result;
    }

    @Override
    public List<ThemeBundleResponse> getTopThemesOfUser(String email) throws Exception {
        List<ThemeBundleResponse> result = new ArrayList<>();
        Random rnd = new Random();
        if (rnd.nextBoolean()) {
            // 체감 테마
             ThemeBundleResponse feelBundle = getFeelBundle();
             while (feelBundle == null){
                 feelBundle = getFeelBundle();
             }
            result.add(feelBundle);
        } else {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new Exception("해당 사용자를 찾을 수 없습니다."));
            // 선호 지역 인기 테마
            int regionId = user.getRegion().getId();
            ThemeBundleResponse regionBundle = getRegionBundle(regionId);
            while (regionBundle == null){
                regionBundle = getRegionBundle(regionId);
            }
            result.add(regionBundle);
        }

        return result;
    }

    @Override
    public ThemeBundleResponse getFeelOrRegionThemesOfUser(String email) throws Exception {
        ThemeBundleResponse result = null;
        Random rnd = new Random();
        if (rnd.nextBoolean()) {
            // 체감 테마
            ThemeBundleResponse feelBundle = getFeelBundle();
            while (feelBundle == null){
                feelBundle = getFeelBundle();
            }
            result = feelBundle;
        } else {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new Exception("해당 사용자를 찾을 수 없습니다."));
            // 선호 지역 인기 테마
            int regionId = user.getRegion().getId();
            ThemeBundleResponse regionBundle = getRegionBundle(regionId);
            while (regionBundle == null){
                regionBundle = getRegionBundle(regionId);
            }
            result = regionBundle;
        }

        return result;
    }

    @Override
    public ThemeBundleResponse getFeelThemes() throws Exception {
        ThemeBundleResponse result = null;
        Random rnd = new Random();
        // 체감 테마
        ThemeBundleResponse feelBundle = getFeelBundle();
        while(feelBundle == null){
            feelBundle = getFeelBundle();
        }
        result = feelBundle;
        return result;
    }

    @Override
    public ThemeBundleResponse getRegionThemes() throws Exception {
        ThemeBundleResponse result = null;
        Random rnd = new Random();

        List<Region> regionList = regionRepository.findAll();
        int idx = regionList.get(rnd.nextInt(regionList.size())).getId(); // 랜덤 지역 id
        // 지역 인기 테마
        ThemeBundleResponse regionBundle = getRegionBundle(idx);
        while(regionBundle == null){
            idx = regionList.get(rnd.nextInt(regionList.size())).getId(); // 랜덤 지역 id
            regionBundle = getRegionBundle(idx);
        }
        result = regionBundle;

        return result;
    }

    @Override
    public AwardThemeBundleResponse getAwardThemes() throws Exception {
        AwardThemeBundleResponse result = null;
        Random rnd = new Random();
        int year = rnd.nextInt(4) + 2019;
        result = new AwardThemeBundleResponse(year, awardThemeRepository.findByYear(year));

        return result;
    }

    @Override
    public Page<PreviewThemeResponse> getSearchThemes(SearchThemeRequest searchThemeRequest) throws Exception {
        JPAQueryFactory jpaQueryFactory = new JPAQueryFactory(entityManager);
        QTheme qTheme = QTheme.theme;
        QGenreOfTheme qGenreOfTheme = QGenreOfTheme.genreOfTheme;

        BooleanBuilder builder = new BooleanBuilder();

        // 검색어가 있으면 검색어를 매장명이나 테마명에서 포함하는 테마들만 가져오도록 조건 추가
        String word = searchThemeRequest.getWord();
        if (!"".equals(word)) {
            builder.and(qTheme.title.contains(word).or(qTheme.storeName.contains(word)));
        }

        // 지역을 선택했으면 해당 지역에 속하는 테마들만 가져오도록 조건 추가
        String regionBig = searchThemeRequest.getRegionBig();
        if (!"전체".equals(regionBig)) {
            builder.and(qTheme.region.regionBig.eq(regionBig));
            String regionSmall = searchThemeRequest.getRegionSmall();
            if (!"전체".equals(regionSmall)) {
                builder.and(qTheme.region.regionSmall.eq(regionSmall));
            }
        }

        // 장르를 선택했으면 해당 장르에 속하는 테마들만 가져오도록 조건 추가
        int genreId = searchThemeRequest.getGenreId();
        if (0 < genreId) {
            builder.and(qGenreOfTheme.genre.id.eq(genreId));
        }

        // 난이도를 선택했으면 해당 난이도 범위의 테마들만 가져오도록 조건 추가
        float difficultyS = searchThemeRequest.getDifficultyS();
        float difficultyE = searchThemeRequest.getDifficultyE();
        if (difficultyS != 1.0 || difficultyE != 5.0) {
            builder.and(qTheme.difficulty.between(difficultyS, difficultyE));
        }

        // 인원수를 선택했으면 해당 인원이 갈 수 있는 테마들만 가져오도록 조건 추가
        int people = searchThemeRequest.getPeople();
        if (0 < people) {
            builder.and(qTheme.minPeople.loe(people)).and(qTheme.maxPeople.goe(people));
        }

        // 시간을 선택했으면 해당 시간 범위에 해당하는 테마들만 가져오도록 조건 추가(1일 시 60분 이하, 2일 시 60분 초과)
        int time = searchThemeRequest.getTime();
        switch (time) {
            case 1:
                builder.and(qTheme.runningTime.loe(60));
                break;
            case 2:
                builder.and(qTheme.runningTime.gt(60));
                break;
        }

        Order order = (searchThemeRequest.getOrderby().equals("asc")) ? Order.ASC : Order.DESC; // 정렬 방식
        Expression<Double> sort = qTheme.userRating; // 무엇을 기준으로 정렬할지
        switch (searchThemeRequest.getSortby()) {
            case "userActivity":
                sort = qTheme.userActivity;
                break;
            case "userFear":
                sort = qTheme.userFear;
                break;
            case "userDifficulty":
                sort = qTheme.userDifficulty;
                break;
        }

        final int size = 14; // 한 페이지에 보여줄 정보의 수
        int page = searchThemeRequest.getPage() - 1; // 불러올 페이지
        Pageable pageable = PageRequest.of(page, size);

        JPAQuery<Theme> contentQuery = jpaQueryFactory
                .selectFrom(qTheme).distinct()
                .join(qTheme.genreOfThemes, qGenreOfTheme)
                .where(builder);

        List<PreviewThemeResponse> content = contentQuery
                .orderBy(new OrderSpecifier<>(order, sort), qTheme.userRating.desc(), qTheme.id.asc())
                .offset((long) size * page)
                .limit(size).fetch()
                .stream().map(PreviewThemeResponse::new)
                .collect(Collectors.toList());

        Page<PreviewThemeResponse> result = PageableExecutionUtils.getPage(content, pageable, contentQuery::fetchCount);

        return result;
    }

    @Override
    public ThemeResponse getThemeInfo(int themeId) throws Exception {
        ThemeResponse result = null;
        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new Exception("해당 테마를 찾을 수 없습니다."));
        result = new ThemeResponse(theme);
        return result;
    }

    @Override
    public void setHotThemes() throws Exception {
        Map<Integer, Integer> themeCnt; // 카운트된 테마의 개수
        int[] themeIds; // 테마 id마다 개수 체크할 배열

        Theme topTheme = themeRepository.findFirstByOrderByIdDesc()
                .orElseThrow(() -> new Exception("해당 테마를 찾을 수 없습니다."));
        int themeArraySize = topTheme.getId();
        themeIds = new int[themeArraySize + 1];

        ////////////////////////////////////////////////////////////////////////////////
        // 리뷰 개수 체크
        reviewRepository.findByModifiedDateAfter(LocalDateTime.now().minusDays(7))
                .forEach(review -> {
                    int themeId = review.getTheme().getId();
                    themeIds[themeId]++;
                });

        // 관심 개수 체크
        interestedRepository.findByModifiedDateAfter(LocalDateTime.now().minusDays(7))
                .forEach(interest -> {
                    int themeId = interest.getTheme().getId();
                    themeIds[themeId]++;
                });

        // 개수 체크된 배열을 리스트로 변경
        List<ThemeCountResponse> list = new ArrayList<>();
        for (int i = 0; i <= themeArraySize; i++) {
            if (themeIds[i] > 0) {
                list.add(new ThemeCountResponse(i, themeIds[i]));
            }
        }

        hotThemeRepository.deleteAll();
        // 핫 한 테마의 개수가 적을 경우
        if (list.size() < 9) {
            // userCnt가 높은 순으로 반환
            themeRepository.findTop9ByOrderByUserCntDesc()
                .forEach(theme -> {
                    HotTheme hotTheme = new HotTheme(theme);
                    hotThemeRepository.save(hotTheme);
                });
        }
        // 핫 한 테마의 개수가 많을 경우
        else {
            // 개수 순으로 내림차순 정렬
            Collections.sort(list, (o1, o2) -> o2.getCount() - o1.getCount());

            for (int i = 0; i < 9; i++) {
                Theme theme = themeRepository.findById(list.get(i).getThemeId())
                        .orElseThrow(()->new RuntimeException("해당 테마를 찾을 수 없습니다."));
                HotTheme hotTheme = new HotTheme(theme);
                hotThemeRepository.save(hotTheme);
            }
        }
    }

}