package salvo.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.SocketPermission;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SalvoControler {

    @Autowired
    private GameRepository gameRepo;

    @Autowired
    private GamePlayerRepository gamePlRepo;

    @RequestMapping("/games")
    public List<Object> returnGames() {
        return gameRepo
                .findAll()
                .stream()
                .map(game -> toDTO(game))
                .collect(Collectors.toList());

    }

    public Map<String, Object> toDTO(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", game.getId());
        dto.put("date", game.getGameDate());
        dto.put("gamePlayers", game.getGamePlayers()
                .stream()
                .map(gamePlayer -> toGP(gamePlayer))
                .collect(Collectors.toList()));
/*       List ids = game.getGamePlayers()
               .stream()
               .map(gamePlayer -> gamePlayer.getPlayer().getId())
               .collect(Collectors.toList());
       dto.put("ids", ids);*/
        return dto;
    }

    public Map<String, Object> toGP(GamePlayer gamePlayers) {
        Map<String, Object> GP = new LinkedHashMap<String, Object>();
        GP.put("id", gamePlayers.getId());
        GP.put("player", toPlayer(gamePlayers));
        return GP;
    }

    public Map<String, Object> toPlayer(GamePlayer gamePlayer){
        Map<String, Object> TP = new LinkedHashMap<String, Object>();
        TP.put("id", gamePlayer.getPlayer().getId());
        TP.put("email", gamePlayer.getPlayer().getUserName());
        return TP;
    }

    @RequestMapping("/game_view/{nn}")
    public Map<String, Object> returnSelectGame(@PathVariable long nn) {
        Map<String, Object> retSG = new LinkedHashMap<String, Object>();

        GamePlayer currentGamePlayer = gamePlRepo.findOne(nn);
        retSG.put("id", currentGamePlayer.getId());
        retSG.put("created", currentGamePlayer.getGamePlayerDate());
        retSG.put("gamePlayers",currentGamePlayer.getGame().getGamePlayers()
                .stream()
                .map(gamePlayer -> toGP(gamePlayer))
                .collect(Collectors.toList()));
        retSG.put("ships", currentGamePlayer.getShips()
                .stream()
                .map(ships -> toBoat(ships))
                .collect(Collectors.toList()));
        retSG.put("salvoes", currentGamePlayer.getGame().getGamePlayers()
                .stream()
                .map(gamePlayer -> toSalvo(gamePlayer))
                .collect(Collectors.toList()));
        return retSG;
    }


    public Map<String, Object> toBoat(Ship ships){
        Map<String, Object> boat = new LinkedHashMap<String, Object>();
        boat.put("type",ships.getType());
        boat.put("locations",ships.getLocations());
        return boat;
    }

    public List<Map<String, Object>> toSalvo(GamePlayer gamePlayer){

        List<Map<String,Object>> salvoMap = new ArrayList<>();

        Set<Salvo> salvos = gamePlayer.getSalvos();

        for (Salvo salvo : salvos) {

            Map<String, Object> eachSalvo = new LinkedHashMap<>();
            eachSalvo.put("turn", salvo.getTurn());
            eachSalvo.put("player", salvo.getGamePlayer().getPlayer().getId());
            eachSalvo.put("salvoLocations", salvo.getSalvoLocations());

            salvoMap.add(eachSalvo);
        }

        return salvoMap;
    }

}