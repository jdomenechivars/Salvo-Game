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
        dto.put("gameId", game.getId());
        dto.put("gameDate", game.getGameDate());
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
        GP.put("gpId", gamePlayers.getId());
        GP.put("player", toPlayer(gamePlayers.getPlayer()));
        return GP;
    }

    public Map<String, Object> toPlayer(Player player){
        Map<String, Object> TP = new LinkedHashMap<String, Object>();
        TP.put("playerId", player.getId());
        TP.put("email", player.getUserName());
        return TP;
    }

    @RequestMapping("/game_view/{nn}")
    public Map<String, Object> returnSelectGame(@PathVariable long nn) {
        Map<String, Object> retSG = new LinkedHashMap<String, Object>();

        GamePlayer currentGamePlayer = gamePlRepo.findOne(nn);
        retSG.put("gpId", currentGamePlayer.getId());
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

        return gamePlayer.getSalvos()
                            .stream()
                            .map(salvo -> salvoToJson(salvo))
                            .collect(Collectors.toList());
    }

    private Map<String, Object> salvoToJson(Salvo salvo) {
        Map<String, Object> eachSalvo = new LinkedHashMap<>();
        eachSalvo.put("turn", salvo.getTurn());
        eachSalvo.put("playerId", salvo.getGamePlayer().getPlayer().getId());
        eachSalvo.put("salvoLocations", salvo.getSalvoLocations());

        return eachSalvo;
    }

}